// MongoDB Model: Har user ki daily AI usage count track karne ke liye
import mongoose, { Schema } from "mongoose";

const aiUsageSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    feature: {
      type: String,
      required: true,
      enum: ["project", "proposal"],
      trim: true,
    },
    // Har din ka alag record banega (format: YYYY-MM-DD)
    date: {
      type: String,
      required: true,
      trim: true,
    },
    // Aaj kitni baar generate kar chuka hai
    count: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // TTL index ke liye: 2 din (172800 seconds) baad document automatically delete ho jayega
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 172800,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: Ek user ek feature ke liye ek din me ek hi document rakhega
aiUsageSchema.index({ userId: 1, feature: 1, date: 1 }, { unique: true });

const AiUsage =
  mongoose.models.AiUsage || mongoose.model("AiUsage", aiUsageSchema);

export default AiUsage;
