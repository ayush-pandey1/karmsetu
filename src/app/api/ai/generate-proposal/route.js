// Backend API route: Freelancer proposal generate karne ke liye endpoint
import { NextResponse } from "next/server";
import { connect } from "@/config/db";
import Project from "@/app/(models)/project";
import User from "@/app/(models)/User";
import { generateProposalInputSchema } from "@/validations/aiProposal";
import { generateProposalWithGemini } from "@/lib/ai/gemini";
import {
  checkAndIncrementAiLimit,
  decrementAiLimit,
} from "@/lib/ai/rateLimiter";

connect();

export async function POST(req) {
  let activeFreelancerId = null;

  try {
    const body = await req.json();

    // Pehle input validate karo
    const inputValidation = generateProposalInputSchema.safeParse(body);
    if (!inputValidation.success) {
      const errorMsg =
        inputValidation.error.issues[0]?.message || "Invalid request parameters";
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
    }

    const { projectId, freelancerId } = inputValidation.data;
    activeFreelancerId = freelancerId;

    // Daily rate limit check karo (Max 3 per day)
    const limitCheck = await checkAndIncrementAiLimit(freelancerId, "proposal", 3);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: limitCheck.message,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Database se project aur freelancer details fetch karo
    const [project, user, completedProjects] = await Promise.all([
      Project.findById(projectId).lean(),
      User.findById(freelancerId).lean(),
      Project.find(
        { freelancerId, status: "Completed" },
        "title description technologies"
      )
        .limit(3)
        .lean(),
    ]);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Freelancer profile not found." },
        { status: 404 }
      );
    }

    // --- Deterministic Relevance Filtering (Token Efficiency ke liye) ---
    // Job ke skills ko lowercase me rakh lo for easy matching
    const jobSkills = (project.technologies || []).map((s) =>
      typeof s === "string" ? s.toLowerCase().trim() : ""
    );

    const userSkills = user.skill || [];

    // Matched skills nikaalo jo job me required hain
    const matchedSkills = userSkills.filter((skill) =>
      jobSkills.some(
        (js) =>
          js &&
          (skill.toLowerCase().includes(js) || js.includes(skill.toLowerCase()))
      )
    );

    // Baki skills me se complimentary skills lo (max 4 extra)
    const otherSkills = userSkills
      .filter((s) => !matchedSkills.includes(s))
      .slice(0, 4);

    const relevantSkills = [...matchedSkills, ...otherSkills].slice(0, 8);

    // Freelancer ke portfolio me se sirf relevant projects filter karo
    const rawPortfolio = user.portfolioDetails || [];
    const relevantPortfolio = rawPortfolio
      .filter((item) => {
        const itemText = `${item.title || ""} ${item.description || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
        return jobSkills.some((js) => js && itemText.includes(js));
      })
      .slice(0, 2)
      .map((item) => ({
        title: item.title,
        description: (item.description || "").slice(0, 120),
      }));

    // Completed projects me se relevant project nikaalo
    const relevantCompleted = (completedProjects || [])
      .filter((cp) => {
        const cpTechs = (cp.technologies || []).map((t) => t.toLowerCase());
        return jobSkills.some((js) => js && cpTechs.some((t) => t.includes(js)));
      })
      .slice(0, 1)
      .map((cp) => ({
        title: cp.title,
        description: (cp.description || "").slice(0, 120),
      }));

    // Ekdam compact JSON context banao taaki token waste na ho
    const contextData = {
      freelancer: {
        name: user.fullname || "Freelancer",
        title: user.professionalTitle || "Professional Freelancer",
        relevantSkills:
          relevantSkills.length > 0 ? relevantSkills : userSkills.slice(0, 5),
        ...(relevantPortfolio.length > 0 && {
          relevantPortfolio,
        }),
        ...(relevantCompleted.length > 0 && {
          relevantCompletedProjects: relevantCompleted,
        }),
      },
      job: {
        title: project.title,
        category: project.projectCategory || "General",
        requiredSkills: project.technologies || [],
        description: (project.description || "").slice(0, 1200),
        budget: project.budget ? `₹${project.budget.toLocaleString("en-IN")}` : undefined,
        duration: project.duration || undefined,
      },
    };

    try {
      // Server-side Gemini service call karo
      const generatedProposal = await generateProposalWithGemini(contextData);

      return NextResponse.json(
        {
          success: true,
          message: "Proposal generated successfully",
          proposal: generatedProposal,
          remaining: limitCheck.remaining,
        },
        { status: 200 }
      );
    } catch (genError) {
      // Agar generation fail ho jaye to user ka daily quota waste na ho, decrement kar do
      await decrementAiLimit(activeFreelancerId, "proposal");
      throw genError;
    }
  } catch (error) {
    console.error("Generate Proposal API Error:", error.message);

    const isApiKeyError =
      error.message?.includes("GEMINI_API_KEY") ||
      error.message?.includes("API key");
    const isRateLimit = error.message?.includes("rate limit");
    const isHighDemand =
      error.message?.includes("high demand") || error.message?.includes("503");

    const statusCode = isHighDemand ? 503 : isApiKeyError ? 503 : isRateLimit ? 429 : 500;

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to generate proposal. Please try again.",
      },
      { status: statusCode }
    );
  }
}
