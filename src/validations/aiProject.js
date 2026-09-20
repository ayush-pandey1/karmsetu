import { z } from "zod";

export const ALLOWED_CATEGORIES = [
  "web-development",
  "app-development",
  "graphic-design",
  "content-writing",
  "software-development",
  "video-production",
  "consulting-strategy",
  "social-media-marketing",
];

const aiMilestoneSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Milestone title must be at least 2 characters")
    .max(120, "Milestone title cannot exceed 120 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Milestone description cannot exceed 1000 characters")
    .default(""),
  amount: z
    .number()
    .min(1, "Milestone percentage must be at least 1%")
    .max(100, "Milestone percentage cannot exceed 100%"),
});

export const aiGeneratedProjectSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title cannot exceed 120 characters"),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters")
      .max(5000, "Description cannot exceed 5000 characters"),
    projectCategory: z.enum(ALLOWED_CATEGORIES, {
      errorMap: () => ({ message: "Invalid project category returned" }),
    }),
    skills: z
      .array(z.string().trim().min(1).max(50))
      .min(1, "At least one skill is required")
      .max(50, "Cannot exceed 50 skills"),
    budget: z
      .number()
      .int("Budget must be an integer")
      .positive("Budget must be positive")
      .min(1, "Budget must be at least ₹1")
      .max(100000000, "Budget cannot exceed ₹100,000,000"),
    duration: z
      .string()
      .trim()
      .min(1, "Duration is required")
      .max(100, "Duration cannot exceed 100 characters"),
    milestones: z
      .array(aiMilestoneSchema)
      .min(1, "At least one milestone is required")
      .max(15, "Cannot exceed 15 milestones"),
  })
  .transform((data) => {
    // Normalize milestone percentages so that their sum equals exactly 100
    const milestones = data.milestones.map((m) => ({
      title: m.title.trim(),
      description: m.description ? m.description.trim() : "",
      amount: Math.round(m.amount),
    }));

    if (milestones.length === 1) {
      milestones[0].amount = 100;
    } else {
      const currentSum = milestones.reduce((sum, m) => sum + m.amount, 0);
      const diff = 100 - currentSum;
      if (diff !== 0) {
        // Apply remainder to the final milestone so the total is strictly 100%
        const lastIndex = milestones.length - 1;
        const adjustedLast = milestones[lastIndex].amount + diff;
        if (adjustedLast > 0) {
          milestones[lastIndex].amount = adjustedLast;
        } else {
          // If subtracting made it <= 0, split evenly across milestones
          const base = Math.floor(100 / milestones.length);
          const remainder = 100 - base * milestones.length;
          milestones.forEach((m, i) => {
            m.amount = base + (i === milestones.length - 1 ? remainder : 0);
          });
        }
      }
    }

    return {
      ...data,
      milestones,
    };
  });
