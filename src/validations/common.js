import { z } from "zod";

/**
 * Common string helper with trimming
 */
export const safeTrimmedString = (min = 1, max = 255, fieldName = "Field") =>
  z
    .string({ required_error: `${fieldName} is required` })
    .trim()
    .min(min, { message: `${fieldName} must be at least ${min} character${min > 1 ? "s" : ""}` })
    .max(max, { message: `${fieldName} must not exceed ${max} characters` });

/**
 * Name schema: trimmed, 2-60 characters, allows international letters, spaces, hyphens, apostrophes
 */
export const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(60, { message: "Name cannot exceed 60 characters" })
  .regex(/^[\p{L}\s'.-]+$/u, { message: "Name contains invalid characters" });

/**
 * Email schema: trimmed, lowercased, valid email format
 */
export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(254, { message: "Email cannot exceed 254 characters" })
  .email({ message: "Please enter a valid email address" });

/**
 * Password schema: min 6 chars, max 100 chars
 */
export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(100, { message: "Password cannot exceed 100 characters" });

/**
 * Age schema:
 * Strictly accepts string digits or finite integer numbers.
 * Rejects exponential notation (e.g. 1.21e+49), negative values, decimals, NaN, Infinity.
 * Valid human age range: [16, 100]
 */
export const ageSchema = z
  .union([z.string(), z.number()])
  .transform((val, ctx) => {
    if (typeof val === "number") {
      if (!Number.isFinite(val) || !Number.isInteger(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Age must be a valid whole number",
        });
        return z.NEVER;
      }
      return val;
    }

    const trimmed = (val || "").trim();
    if (!trimmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age is required",
      });
      return z.NEVER;
    }

    // Strict whole number regex (no scientific notation 'e', decimals '.', signs '+/-')
    if (!/^\d+$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age must contain digits only without exponential or decimal notation",
      });
      return z.NEVER;
    }

    const parsed = Number(trimmed);
    if (!Number.isSafeInteger(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age is outside realistic range",
      });
      return z.NEVER;
    }

    return parsed;
  })
  .pipe(
    z
      .number()
      .min(16, { message: "Age must be at least 16 years" })
      .max(100, { message: "Age must be 100 years or younger" })
  );

/**
 * Phone schema:
 * Always treated as a string.
 * Strictly checks for 10-15 digits with optional leading '+' (e.g. standard country format or 10-digit Indian phone).
 * Rejects exponential notation like 9.20e+72, letters, spaces inside digits.
 */
export const phoneSchema = z
  .union([z.string(), z.number()])
  .transform((val, ctx) => {
    if (typeof val === "number") {
      if (!Number.isSafeInteger(val) || val <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number format",
        });
        return z.NEVER;
      }
      return String(val);
    }
    return (val || "").trim();
  })
  .pipe(
    z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(16, { message: "Phone number cannot exceed 16 characters" })
      .regex(/^\+?[0-9]{10,15}$/, {
        message: "Please enter a valid phone number (10-15 digits, optional leading +)",
      })
  );

/**
 * URL schema:
 * Validates http/https web URLs or allows empty/optional where suitable
 */
export const optionalUrlSchema = z
  .string()
  .trim()
  .max(500, { message: "URL cannot exceed 500 characters" })
  .optional()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch (_) {
        return false;
      }
    },
    { message: "Please enter a valid URL (starting with http:// or https://)" }
  );

/**
 * Money / Budget schema:
 * Positive finite number between ₹1 and ₹100,000,000
 */
export const moneySchema = z
  .union([z.string(), z.number()])
  .transform((val, ctx) => {
    if (typeof val === "number") {
      if (!Number.isFinite(val) || isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Budget must be a valid finite number",
        });
        return z.NEVER;
      }
      return Math.round(val);
    }

    const trimmed = (val || "").trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Budget must be a valid positive integer amount",
      });
      return z.NEVER;
    }

    const parsed = Number(trimmed);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Budget must be a realistic positive amount",
      });
      return z.NEVER;
    }

    return parsed;
  })
  .pipe(
    z
      .number()
      .min(1, { message: "Budget must be at least ₹1" })
      .max(100000000, { message: "Budget cannot exceed ₹100,000,000" })
  );

/**
 * Milestone Percentage schema: 1 to 100
 */
export const milestonePercentageSchema = z
  .union([z.string(), z.number()])
  .transform((val, ctx) => {
    const num = typeof val === "number" ? val : parseFloat((val || "").trim());
    if (isNaN(num) || !Number.isFinite(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Milestone percentage must be a valid number",
      });
      return z.NEVER;
    }
    return Math.round(num * 100) / 100;
  })
  .pipe(
    z
      .number()
      .min(1, { message: "Milestone amount must be at least 1%" })
      .max(100, { message: "Milestone amount cannot exceed 100%" })
  );
