import { NextResponse } from "next/server";

/**
 * Helper to validate request bodies on the backend using Zod.
 * Returns { success: true, data } or { success: false, response: NextResponse }
 */
export function validateRequestBody(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues || [];
    const firstErrorMessage = issues[0]?.message || "Validation failed";
    const fieldErrors = {};

    issues.forEach((issue) => {
      const field = issue.path.join(".");
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      success: false,
      response: NextResponse.json(
        {
          message: firstErrorMessage,
          error: firstErrorMessage,
          errors: fieldErrors,
          issues: issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}
