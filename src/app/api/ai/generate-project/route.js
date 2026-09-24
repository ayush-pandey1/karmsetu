import { NextResponse } from "next/server";
import { generateProjectWithGemini } from "@/lib/ai/gemini";
import {
  checkAndIncrementAiLimit,
  decrementAiLimit,
} from "@/lib/ai/rateLimiter";

export async function POST(req) {
  let activeClientId = null;

  try {
    const body = await req.json();
    const { prompt, clientId } = body || {};

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

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to use AI project generation.",
        },
        { status: 401 }
      );
    }

    activeClientId = clientId;

    // Daily rate limit check karo (Max 3 per day)
    const limitCheck = await checkAndIncrementAiLimit(clientId, "project", 3);
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

    try {
      const generatedProject = await generateProjectWithGemini(prompt);

      return NextResponse.json(
        {
          success: true,
          message: "Project generated successfully",
          data: generatedProject,
          remaining: limitCheck.remaining,
        },
        { status: 200 }
      );
    } catch (genError) {
      // Agar AI call fail ho jaye to user ka daily quota waste na ho, decrement kar do
      await decrementAiLimit(activeClientId, "project");
      throw genError;
    }
  } catch (error) {
    console.error("AI Project Generation API Route Error:", error.message);

    const isApiKeyError =
      error.message?.includes("API_KEY") ||
      error.message?.includes("API key");
    const isRateLimit = error.message?.includes("rate limit");
    const isHighDemand =
      error.message?.includes("high demand") || error.message?.includes("503");

    const statusCode = isHighDemand ? 503 : isApiKeyError ? 503 : isRateLimit ? 429 : 500;

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to generate project with AI. Please try again.",
      },
      { status: statusCode }
    );
  }
}
