import { z } from "zod";
import {
  safeTrimmedString,
  emailSchema,
  phoneSchema,
  ageSchema,
  optionalUrlSchema,
} from "./common";

/**
 * Client profile onboarding/update schema
 */
export const clientProfileSchema = z.object({
  email: emailSchema,
  phoneNumber: phoneSchema,
  age: ageSchema,
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be either male or female" }),
  }),
  address: safeTrimmedString(2, 300, "Address"),
  companyName: safeTrimmedString(2, 100, "Company Name"),
  industry: safeTrimmedString(2, 100, "Industry"),
  bio: safeTrimmedString(10, 2000, "Bio"),
  socialMedia: optionalUrlSchema,
  role: z.literal("client").optional().default("client"),
  photo: optionalUrlSchema,
  coordinates: z.any().optional(),
});

/**
 * Freelancer profile onboarding/update schema
 */
export const freelancerProfileSchema = z.object({
  email: emailSchema,
  phoneNumber: phoneSchema,
  age: ageSchema,
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be either male or female" }),
  }),
  address: safeTrimmedString(2, 300, "Address"),
  professionalTitle: safeTrimmedString(2, 100, "Professional Title"),
  skills: z
    .array(z.string().trim().min(1).max(50))
    .min(1, { message: "Please select at least one skill" })
    .max(50, { message: "Cannot select more than 50 skills" }),
  portfolioLink: optionalUrlSchema,
  bio: safeTrimmedString(10, 2000, "Bio"),
  socialMedia: optionalUrlSchema,
  role: z.literal("freelancer").optional().default("freelancer"),
  photo: optionalUrlSchema,
  coordinates: z.any().optional(),
});
