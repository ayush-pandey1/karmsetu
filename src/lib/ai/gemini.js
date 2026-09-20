import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AI_CONFIG } from "@/config/ai";
import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLES } from "./prompts/projectGenerator";
import { aiGeneratedProjectSchema } from "@/validations/aiProject";

/**
 * Initializes and returns a GoogleGenerativeAI client.
 * Strictly verifies that GEMINI_API_KEY is defined in server environment.
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your environment variables."
    );
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * Generation schema for structured JSON output
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
      description: "Project category code strictly matching one of the allowed categories",
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
      description: "Array of required technical skills, tools, or domain capabilities",
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
      description: "Milestone breakdown whose percentages sum to exactly 100",
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
 * Generates structured project data from a raw client prompt using Gemini.
 *
 * @param {string} userPrompt - Unstructured project requirements from the client
 * @returns {Promise<object>} Validated and normalized project data matching form requirements
 */
export async function generateProjectWithGemini(userPrompt) {
  if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
    throw new Error("A valid prompt is required for AI generation.");
  }

  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.model,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: projectResponseSchema,
      temperature: AI_CONFIG.temperature,
      topP: AI_CONFIG.topP,
      topK: AI_CONFIG.topK,
      maxOutputTokens: AI_CONFIG.maxOutputTokens,
    },
  });

  // Assemble conversation with few-shot history followed by user prompt
  const contents = [
    ...FEW_SHOT_EXAMPLES,
    {
      role: "user",
      parts: [{ text: userPrompt.trim() }],
    },
  ];

  let rawResponseText = "";
  try {
    const result = await model.generateContent({ contents });
    const response = await result.response;
    rawResponseText = response.text();
  } catch (apiError) {
    console.error("Gemini API execution error:", apiError);
    if (apiError.status === 429 || apiError.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("AI service rate limit reached. Please wait a moment and try again.");
    }
    if (apiError.message?.includes("API_KEY_INVALID") || apiError.status === 400) {
      throw new Error("Invalid or unauthorized Gemini API key configured.");
    }
    throw new Error(apiError.message || "Failed to communicate with the Gemini AI service.");
  }

  // Parse JSON response
  let parsedJson;
  try {
    parsedJson = JSON.parse(rawResponseText);
  } catch (parseError) {
    console.error("Failed to parse Gemini response as JSON:", rawResponseText);
    throw new Error("The AI service returned an unreadable response format.");
  }

  // Validate and normalize schema via Zod
  const validationResult = aiGeneratedProjectSchema.safeParse(parsedJson);
  if (!validationResult.success) {
    console.error("AI Output Zod validation failed:", validationResult.error.format());
    const firstIssue = validationResult.error.issues[0]?.message || "Invalid project structure";
    throw new Error(`AI generated project validation failed: ${firstIssue}`);
  }

  return validationResult.data;
}
