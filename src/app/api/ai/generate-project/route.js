import { NextResponse } from "next/server";
import { generateProjectWithGemini } from "@/lib/ai/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body || {};

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a descriptive prompt with at least 5 characters.",
        },
        { status: 400 }
      );
    }

    if (prompt.trim().length > 4000) {
      return NextResponse.json(
        {
          success: false,
          message: "Prompt is too long. Please keep it under 4000 characters.",
        },
        { status: 400 }
      );
    }

    const generatedProject = await generateProjectWithGemini(prompt);

    return NextResponse.json(
      {
        success: true,
        message: "Project generated successfully",
        data: generatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI Project Generation API Route Error:", error.message);

    const isApiKeyError =
      error.message?.includes("GEMINI_API_KEY") ||
      error.message?.includes("API key");
    const isRateLimit = error.message?.includes("rate limit");

    const statusCode = isApiKeyError ? 503 : isRateLimit ? 429 : 500;

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to generate project with AI. Please try again.",
      },
      { status: statusCode }
    );
  }
}
