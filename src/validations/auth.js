import { z } from "zod";
import { nameSchema, emailSchema, passwordSchema } from "./common";

export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  fullname: z.string().trim().max(120).optional(),
  role: z.enum(["client", "freelancer"], {
    errorMap: () => ({ message: "Role must be either 'client' or 'freelancer'" }),
  }),
});

export const signinSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});
