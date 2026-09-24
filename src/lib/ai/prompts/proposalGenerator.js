// Freelancer proposal generation ke liye system prompt aur one-shot example
import { SchemaType } from "@google/generative-ai";

export const PROPOSAL_SYSTEM_PROMPT = `You are Karmsetu's AI Proposal Assistant. Your job is to draft a concise, compelling, and personalized freelance proposal using ONLY the provided freelancer and job data.

### Critical Rules:
1. Strict Honesty: NEVER invent skills, experiences, portfolio items, statistics, or past projects. Use ONLY information provided in the input. If a detail is missing, write the proposal smoothly without it.
2. Tone & Length: Professional, confident, friendly, and direct. Write 2-3 short paragraphs (100-180 words total).
3. Structure:
   - Hook: Direct statement showing clear understanding of the project requirement.
   - Proof & Approach: Highlight matching skills and relevant past work to solve the client's problem.
   - Call to Action: Professional closing inviting a discussion.
4. No Fluff: Do NOT use generic greetings like "Dear Hiring Manager" or "I am thrilled to submit my proposal". Start directly with the value proposition.
5. Return ONLY structured JSON matching the schema with the "proposal" text field.`;

// Token bachaane ke liye sirf ek chhota one-shot example rakha hai
export const PROPOSAL_ONE_SHOT_EXAMPLE = [
  {
    role: "user",
    parts: [
      {
        text: JSON.stringify({
          freelancer: {
            name: "Rahul",
            title: "Full-Stack Developer",
            relevantSkills: ["React.js", "Node.js", "MongoDB", "Razorpay"],
            relevantPortfolio: [
              {
                title: "Clothing E-Commerce Platform",
                description: "Built full-stack clothing store with catalog, cart, and Razorpay payments.",
              },
            ],
          },
          job: {
            title: "Online Apparel Store with Payment Integration",
            category: "Web Development",
            requiredSkills: ["React.js", "Node.js", "MongoDB"],
            description: "Need a modern web store for our fashion brand with responsive product browsing and payment checkout.",
            budget: 50000,
            duration: "1 Month",
          },
        }),
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: JSON.stringify({
          proposal:
            "Hi, I saw that you need a modern web store for your fashion brand with seamless product browsing and payment checkout. Having built full-stack e-commerce platforms using React.js, Node.js, and MongoDB with integrated Razorpay payments, I can build an intuitive, mobile-responsive store tailored to your brand.\n\nMy approach will focus on clean product filtering, a secure checkout flow, and easy catalog management for your team. I can comfortably align with your 1-month timeline and milestone budget.\n\nLet's connect to review your brand design preferences and get started.",
        }),
      },
    ],
  },
];

// Gemini structured response schema - sirf proposal string mangenge
export const proposalResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    proposal: {
      type: SchemaType.STRING,
      description: "A concise, personalized freelance proposal pitch (approx 100-180 words, 2-3 short paragraphs).",
    },
  },
  required: ["proposal"],
};
