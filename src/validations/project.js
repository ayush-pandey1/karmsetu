import { z } from "zod";
import {
  safeTrimmedString,
  moneySchema,
  milestonePercentageSchema,
  optionalUrlSchema,
} from "./common";

/**
 * Milestone item schema for job creation
 */
export const milestoneItemSchema = z.object({
  title: safeTrimmedString(2, 100, "Milestone title"),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  amount: milestonePercentageSchema,
  status: z
    .enum(["Not Applied", "Pending Approval", "Approved"])
    .optional()
    .default("Not Applied"),
  paymentStatus: z.enum(["Pending", "Completed"]).optional().default("Pending"),
});

/**
 * Create job posting schema
 */
export const createJobSchema = z.object({
  title: safeTrimmedString(5, 120, "Job title"),
  description: safeTrimmedString(20, 5000, "Job description"),
  projectCategory: safeTrimmedString(1, 100, "Project category"),
  skills: z
    .array(z.string().trim().min(1).max(50))
    .min(1, { message: "Please select or add at least one skill." })
    .max(50, { message: "Cannot add more than 50 skills" }),
  budget: moneySchema,
  duration: safeTrimmedString(1, 100, "Duration / Deadline"),
  clientId: z.string().trim().min(1, { message: "Client ID is required" }),
});

/**
 * Milestone Freelancer Status update (Apply review)
 */
export const freelancerMilestoneReviewSchema = z.object({
  milestoneId: z.string().trim().min(1, { message: "Milestone ID is required" }),
  status: z.literal("Pending Approval", {
    errorMap: () => ({ message: "Status must be 'Pending Approval'" }),
  }),
  message: safeTrimmedString(5, 2000, "Milestone completion message"),
});

/**
 * Milestone Client Status update (Approve/Reject)
 */
export const clientMilestoneReviewSchema = z.object({
  milestoneId: z.string().trim().min(1, { message: "Milestone ID is required" }),
  status: z.enum(["Approved", "Not Applied"], {
    errorMap: () => ({ message: "Status must be either 'Approved' or 'Not Applied'" }),
  }),
});

/**
 * Application Store schema
 */
export const applicationSubmissionSchema = z.object({
  clientId: z.string().trim().min(1, { message: "Client ID is required" }),
  message: safeTrimmedString(5, 2000, "Application message"),
  freelancer: z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    fullname: z.string().trim().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional().or(z.literal("")),
    professionalTitle: z.string().optional().or(z.literal("")),
    skill: z.array(z.string()).optional(),
    imageLink: optionalUrlSchema,
  }),
  project: z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    title: z.string().trim().min(1).max(200),
    description: z.string().optional().or(z.literal("")),
    budget: z.number().optional(),
    status: z.string().optional(),
  }),
});
