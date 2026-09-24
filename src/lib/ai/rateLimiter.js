// Rate limiter utility: Daily 3 attempts limit handle karta hai
import AiUsage from "@/app/(models)/AiUsage";
import { connect } from "@/config/db";

// Aaj ki date nikaalne ka helper function (IST timezone ke hisab se YYYY-MM-DD)
export function getTodayDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

/**
 * Check karta hai aur atomic tareeke se usage increment karta hai.
 * @param {string} userId - Freelancer ya Client ki ID
 * @param {"project" | "proposal"} feature - Kon sa AI feature use ho raha hai
 * @param {number} maxLimit - Daily maximum limit (default: 3)
 * @returns {Promise<{ allowed: boolean, count: number, remaining: number, message?: string }>}
 */
export async function checkAndIncrementAiLimit(userId, feature, maxLimit = 3) {
  if (!userId) {
    return {
      allowed: false,
      count: 0,
      remaining: 0,
      message: "User ID missing hai. Please login karke try karein.",
    };
  }

  // Database connect ensure karo
  await connect();
  const date = getTodayDateKey();

  // Pehle check kar lo agar user already limit reach kar chuka hai
  // Isse bina wajah database me extra update operation nahi hoga
  const existing = await AiUsage.findOne({ userId, feature, date }).lean();
  if (existing && existing.count >= maxLimit) {
    return {
      allowed: false,
      count: existing.count,
      remaining: 0,
      message: `Aapka aaj ka AI generation limit (${maxLimit}/${maxLimit}) pura ho chuka hai. Kripya kal dobara koshish karein.`,
    };
  }

  // Atomic operation ($inc): Race conditions se bachata hai jab ek sath 2 requests aayein
  const updated = await AiUsage.findOneAndUpdate(
    { userId, feature, date },
    {
      $inc: { count: 1 },
      $setOnInsert: { createdAt: new Date() },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  // Agar parallel request ki wajah se count limit se zyada nikal gaya ho
  if (updated.count > maxLimit) {
    return {
      allowed: false,
      count: updated.count,
      remaining: 0,
      message: `Aapka aaj ka AI generation limit (${maxLimit}/${maxLimit}) pura ho chuka hai. Kripya kal dobara koshish karein.`,
    };
  }

  return {
    allowed: true,
    count: updated.count,
    remaining: Math.max(0, maxLimit - updated.count),
  };
}

/**
 * Agar AI generation kisi error se fail ho jaye, to user ka attempt rollback (decrement) kar dete hain.
 * Taaki system failure ki wajah se user ka quota bekar na jaye.
 * @param {string} userId
 * @param {"project" | "proposal"} feature
 */
export async function decrementAiLimit(userId, feature) {
  try {
    if (!userId) return;
    await connect();
    const date = getTodayDateKey();

    await AiUsage.findOneAndUpdate(
      { userId, feature, date, count: { $gt: 0 } },
      { $inc: { count: -1 } }
    );
  } catch (err) {
    console.error("Failed to decrement AI usage quota on error:", err.message);
  }
}

/**
 * Sirf check karne ke liye ki kitne attempts bache hain (increment kiye bina)
 * @param {string} userId
 * @param {"project" | "proposal"} feature
 * @param {number} maxLimit
 */
export async function getRemainingAiLimit(userId, feature, maxLimit = 3) {
  if (!userId) return { count: 0, remaining: maxLimit };
  try {
    await connect();
    const date = getTodayDateKey();
    const existing = await AiUsage.findOne({ userId, feature, date }).lean();
    const count = existing?.count || 0;
    return {
      count,
      remaining: Math.max(0, maxLimit - count),
    };
  } catch (err) {
    console.error("Error fetching remaining AI limit:", err.message);
    return { count: 0, remaining: maxLimit };
  }
}
