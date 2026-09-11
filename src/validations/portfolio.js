import { z } from "zod";
import { safeTrimmedString, optionalUrlSchema } from "./common";

export const portfolioProjectSchema = z.object({
  title: safeTrimmedString(2, 100, "Project title"),
  description: safeTrimmedString(10, 2000, "Project description"),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(20, { message: "Cannot have more than 20 tags" })
    .default([]),
  imageLink: optionalUrlSchema,
});
