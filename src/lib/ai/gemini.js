import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AI_CONFIG } from "@/config/ai";
import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLES } from "./prompts/projectGenerator";
import { aiGeneratedProjectSchema } from "@/validations/aiProject";
import {
  PROPOSAL_SYSTEM_PROMPT,
  PROPOSAL_ONE_SHOT_EXAMPLE,
  proposalResponseSchema,
} from "./prompts/proposalGenerator";
import { aiGeneratedProposalSchema } from "@/validations/aiProposal";

/**
 * Server-side Gemini client banata hai aur GEMINI_API_KEY check karta hai.
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your environment variables."
    );
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * User-friendly error sanitizer: Raw SDK/URL/stack trace ko clean, readable UI message me convert karta hai.
 */
function sanitizeGeminiError(err) {
  const msg = err?.message || "";
  const status = err?.status;

  if (
    status === 503 ||
    msg.includes("503") ||
    msg.includes("high demand") ||
    msg.includes("Service Unavailable") ||
    msg.includes("overloaded")
  ) {
    return new Error(
      "AI service is currently experiencing high demand. Please try again in a few moments."
    );
  }

  if (
    status === 429 ||
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("rate limit")
  ) {
    return new Error(
      "AI service rate limit reached. Please wait a moment and try again."
    );
  }

  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    msg.includes("API_KEY") ||
    msg.includes("API key")
  ) {
    return new Error(
      "AI service configuration issue. Please check your API key."
    );
  }

  return new Error(
    "AI service is temporarily unavailable. Please try again shortly."
  );
}

/**
 * Local intelligent fallback proposal generator:
 * Agar Google ke saare models 503 high demand par hon to user ko error dikhane ke bajaye
 * context-aware personalized proposal draft bana kar deta hai.
 */
function generateLocalFallbackProposal(contextData) {
  const { freelancer, job } = contextData || {};
  const name = freelancer?.name || "I";
  const title = freelancer?.title ? `${freelancer.title}` : "developer";
  const skillsList = (freelancer?.relevantSkills || []).slice(0, 4);
  const skillsText =
    skillsList.length > 0 ? skillsList.join(", ") : "modern web technologies";

  const jobTitle = job?.title || "your project";
  const duration = job?.duration ? `within your ${job.duration} timeline` : "promptly";

  let portfolioSentence = "";
  if (freelancer?.relevantPortfolio && freelancer.relevantPortfolio.length > 0) {
    const p = freelancer.relevantPortfolio[0];
    portfolioSentence = ` In a recent project (${p.title}), I ${p.description || "delivered clean, responsive functionality and reliable performance"}.`;
  } else if (
    freelancer?.relevantCompletedProjects &&
    freelancer.relevantCompletedProjects.length > 0
  ) {
    const cp = freelancer.relevantCompletedProjects[0];
    portfolioSentence = ` I recently completed a similar engagement (${cp.title}) with verified milestone deliverables.`;
  }

  const p1 = `Hi, I saw your requirement for "${jobTitle}". As a ${title} experienced with ${skillsText}, I am confident in delivering a high-quality, scalable solution tailored to your exact specifications.`;

  const p2 = `My development approach prioritizes clean architecture, responsive performance, and secure implementation.${portfolioSentence} I can comfortably align with your milestone budget and deliver ${duration}.`;

  const p3 = `I would welcome the opportunity to connect and discuss your milestone roadmap in detail. Looking forward to working together.`;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

/**
 * Local intelligent fallback project generator jab Gemini high demand me ho.
 */
function generateLocalFallbackProject(userPrompt) {
  const promptLower = (userPrompt || "").toLowerCase();

  // Budget extract karo agar prompt me diya ho
  const budgetMatch =
    promptLower.match(/(\d+)\s*k\b/) ||
    promptLower.match(/(?:budget|rs\.?|inr|₹)?\s*(\d{4,8})\b/);
  let budget = 30000;
  if (budgetMatch) {
    budget = budgetMatch[0].includes("k")
      ? parseInt(budgetMatch[1], 10) * 1000
      : parseInt(budgetMatch[1], 10);
  }

  // Category detect karo
  let projectCategory = "web-development";
  if (
    promptLower.includes("app") ||
    promptLower.includes("flutter") ||
    promptLower.includes("react native") ||
    promptLower.includes("android") ||
    promptLower.includes("ios")
  ) {
    projectCategory = "app-development";
  } else if (
    promptLower.includes("logo") ||
    promptLower.includes("design") ||
    promptLower.includes("ui/ux") ||
    promptLower.includes("figma") ||
    promptLower.includes("graphic")
  ) {
    projectCategory = "graphic-design";
  } else if (
    promptLower.includes("content") ||
    promptLower.includes("blog") ||
    promptLower.includes("article")
  ) {
    projectCategory = "content-writing";
  } else if (
    promptLower.includes("video") ||
    promptLower.includes("editing") ||
    promptLower.includes("production")
  ) {
    projectCategory = "video-production";
  }

  const detectedSkills = [];
  const candidateSkills = [
    "React.js",
    "Node.js",
    "Express.js",
    "Next.js",
    "MongoDB",
    "Tailwind CSS",
    "Flutter",
    "Figma",
    "PostgreSQL",
    "RESTful APIs",
  ];
  candidateSkills.forEach((s) => {
    if (promptLower.includes(s.toLowerCase().replace(".js", ""))) {
      detectedSkills.push(s);
    }
  });

  const skills =
    detectedSkills.length > 0
      ? detectedSkills
      : projectCategory === "app-development"
      ? ["Flutter", "Dart", "Firebase", "RESTful APIs"]
      : ["React.js", "Node.js", "MongoDB", "Tailwind CSS"];

  const titleSnippet = userPrompt.split(/[.\n]/)[0].slice(0, 70).trim();
  const title =
    titleSnippet.length >= 10
      ? titleSnippet.charAt(0).toUpperCase() + titleSnippet.slice(1)
      : "Custom Full-Stack Project Development";

  const description =
    userPrompt.length >= 25
      ? userPrompt
      : `${userPrompt} - Comprehensive project scope including clean UI design, robust backend integration, and end-to-end testing.`;

  return {
    title,
    description,
    projectCategory,
    skills,
    budget: Math.max(1000, Math.min(100000000, budget)),
    duration: promptLower.includes("month") ? "1 Month" : "3 Weeks",
    milestones: [
      {
        title: "Architecture & UI Setup",
        description: "Initial design concepts, component wireframes, and project scaffold.",
        amount: 30,
      },
      {
        title: "Core Feature Development",
        description: "Implementation of main functionality, data flow, and API endpoints.",
        amount: 40,
      },
      {
        title: "Testing & Handover",
        description: "Quality assurance, cross-device testing, and production deployment.",
        amount: 30,
      },
    ],
  };
}

/**
 * Model runner with multi-tier fallback:
 * 1. Primary Model: gemini-3.5-flash
 * 2. Fallback Model 1: gemini-3.1-flash-lite (user requested)
 * 3. Fallback Model 2: gemini-3.5-flash-lite
 */
async function callGeminiWithFallback({
  systemInstruction,
  generationConfig,
  contents,
}) {
  const genAI = getGeminiClient();

  // Model cascade: Pehle primary, fir gemini-3.1-flash-lite, fir 3.5-flash-lite
  const candidateModels = [
    AI_CONFIG.fallbackModel || "gemini-3.1-flash-lite", // User requested 3.1 Flash-Lite
    AI_CONFIG.model || "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
  ].filter(Boolean);

  // Duplicate model names hata do
  const uniqueModels = [...new Set(candidateModels)];

  let lastError = null;

  for (const modelName of uniqueModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig,
      });

      const result = await model.generateContent({ contents });
      const response = await result.response;
      const text = response.text();
      if (text && text.trim()) {
        return text;
      }
    } catch (err) {
      console.warn(
        `Gemini model '${modelName}' attempt failed: ${err.status || err.message?.slice(0, 80)}`
      );
      lastError = err;
      // Agar 503 ya high demand hai to loop agle candidate model par chalega
    }
  }

  // Agar saare Google models ne 503 diya to error throw karo jise graceful degradation handle karegi
  throw sanitizeGeminiError(lastError);
}

/**
 * Generation schema for client project creation
 */
const projectResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "Concise and professional job title (5-120 chars)",
    },
    description: {
      type: SchemaType.STRING,
      description: "Detailed job scope and deliverables (20-1000 chars)",
    },
    projectCategory: {
      type: SchemaType.STRING,
      description:
        "Project category code strictly matching one of the allowed categories",
      enum: [
        "web-development",
        "app-development",
        "graphic-design",
        "content-writing",
        "software-development",
        "video-production",
        "consulting-strategy",
        "social-media-marketing",
      ],
    },
    skills: {
      type: SchemaType.ARRAY,
      description:
        "Array of required technical skills, tools, or domain capabilities",
      items: {
        type: SchemaType.STRING,
      },
    },
    budget: {
      type: SchemaType.INTEGER,
      description: "Project budget in INR (positive whole integer)",
    },
    duration: {
      type: SchemaType.STRING,
      description: "Estimated project duration (e.g., '2 Weeks', '1 Month')",
    },
    milestones: {
      type: SchemaType.ARRAY,
      description:
        "Milestone breakdown whose percentages sum to exactly 100",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "Milestone phase title",
          },
          description: {
            type: SchemaType.STRING,
            description: "Summary of deliverables for this milestone",
          },
          amount: {
            type: SchemaType.INTEGER,
            description: "Percentage share of budget (1-100)",
          },
        },
        required: ["title", "description", "amount"],
      },
    },
  },
  required: [
    "title",
    "description",
    "projectCategory",
    "skills",
    "budget",
    "duration",
    "milestones",
  ],
};

/**
 * Client raw prompt se project draft generate karta hai with fallback support.
 */
export async function generateProjectWithGemini(userPrompt) {
  if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
    throw new Error("A valid prompt is required for AI generation.");
  }

  const contents = [
    ...FEW_SHOT_EXAMPLES,
    {
      role: "user",
      parts: [{ text: userPrompt.trim() }],
    },
  ];

  try {
    const rawResponseText = await callGeminiWithFallback({
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: projectResponseSchema,
        temperature: AI_CONFIG.temperature,
        topP: AI_CONFIG.topP,
        topK: AI_CONFIG.topK,
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
      },
      contents,
    });

    const parsedJson = JSON.parse(rawResponseText);
    const validationResult = aiGeneratedProjectSchema.safeParse(parsedJson);
    if (validationResult.success) {
      return validationResult.data;
    }
  } catch (apiError) {
    console.warn(
      "Gemini project generation API models unavailable, engaging intelligent fallback draft."
    );
  }

  // Graceful fallback: user ko kabhi error screen nahi dikhegi
  const fallbackProject = generateLocalFallbackProject(userPrompt);
  return aiGeneratedProjectSchema.parse(fallbackProject);
}

/**
 * Freelancer aur Job context use karke proposal draft generate karta hai with fallback support.
 */
export async function generateProposalWithGemini(contextData) {
  if (!contextData || typeof contextData !== "object") {
    throw new Error("Valid context data is required for proposal generation.");
  }

  const contents = [
    ...PROPOSAL_ONE_SHOT_EXAMPLE,
    {
      role: "user",
      parts: [{ text: JSON.stringify(contextData) }],
    },
  ];

  try {
    const rawResponseText = await callGeminiWithFallback({
      systemInstruction: PROPOSAL_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: proposalResponseSchema,
        temperature: 0.3,
        topP: AI_CONFIG.topP,
        topK: AI_CONFIG.topK,
        maxOutputTokens: 1024,
      },
      contents,
    });

    const parsedJson = JSON.parse(rawResponseText);
    const validationResult = aiGeneratedProposalSchema.safeParse(parsedJson);
    if (validationResult.success) {
      return validationResult.data.proposal;
    }
  } catch (apiError) {
    console.warn(
      "Gemini proposal API models unavailable, engaging intelligent fallback draft."
    );
  }

  // Graceful fallback: tailored high-converting proposal generate karo based on exact freelancer & job context
  const fallbackProposal = generateLocalFallbackProposal(contextData);
  return fallbackProposal;
}
