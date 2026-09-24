// Zod validations for proposal generator - request aur response dono check karenge
import { z } from "zod";

// Frontend se aane wale request parameters validate karte hain
export const generateProposalInputSchema = z.object({
  projectId: z.string().trim().min(1, "Project ID is required"),
  freelancerId: z.string().trim().min(1, "Freelancer ID is required"),
});

// Gemini se aane wala structured response validate karte hain
export const aiGeneratedProposalSchema = z.object({
  proposal: z
    .string()
    .trim()
    .min(20, "Generated proposal must be at least 20 characters")
    .max(2000, "Generated proposal cannot exceed 2000 characters"),
});
