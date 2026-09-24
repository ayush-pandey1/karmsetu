"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  LuSparkles,
  LuLightbulb,
  LuCheck,
  LuArrowRight,
  LuAlertCircle,
  LuClock,
} from "react-icons/lu";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import axios from "axios";
import toast from "react-hot-toast";

const PROMPT_SUGGESTIONS = [
  "Build a modern e-commerce clothing store with cart, payments, and admin panel. Budget 50k, 1 month timeline.",
  "Cross-platform Flutter fitness tracking app with workout plans, streak tracking, and push notifications.",
  "Minimalist logo, typography, and packaging design for a premium organic tea brand.",
  "Full SEO content marketing strategy and 10 technical blog articles for a B2B SaaS startup.",
];

export const AIProjectGeneratorDialog = ({
  isOpen,
  onOpenChange,
  onApplyGeneratedProject,
  clientId,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [remainingGenerations, setRemainingGenerations] = useState(null);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || trimmed.length < 5) {
      setErrorMessage(
        "Please enter at least a few words describing your project.",
      );
      return;
    }

    // Client ID prop se lo ya session storage se extract karo
    let activeClientId = clientId;
    if (!activeClientId && typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("karmsetu");
        if (raw) {
          const parsed = JSON.parse(raw);
          activeClientId = parsed?.id || parsed?._id;
        }
      } catch (e) {
        console.error("Session parse error", e);
      }
    }

    if (!activeClientId) {
      setErrorMessage("Please log in to use AI project generation.");
      toast.error("Please log in to use AI project generation.");
      return;
    }

    setErrorMessage("");
    setIsGenerating(true);

    try {
      const response = await axios.post("/api/ai/generate-project", {
        prompt: trimmed,
        clientId: activeClientId,
      });

      if (response.data?.success && response.data?.data) {
        setGeneratedData(response.data.data);
        if (response.data?.remaining !== undefined) {
          setRemainingGenerations(response.data.remaining);
        }
        toast.success("Project generated successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to generate project");
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      const rawMsg = err.response?.data?.message || err.message || "";
      let cleanMsg = "An unexpected error occurred while communicating with AI.";

      if (err.response?.status === 429) {
        cleanMsg =
          err.response?.data?.message ||
          "Daily limit reached (3/3). Please try again tomorrow.";
      } else if (
        rawMsg.includes("503") ||
        rawMsg.includes("high demand") ||
        rawMsg.includes("Service Unavailable") ||
        rawMsg.includes("overloaded")
      ) {
        cleanMsg = "AI service is currently experiencing high demand. Please try again in a few moments.";
      } else if (
        rawMsg.includes("rate limit") ||
        rawMsg.includes("RESOURCE_EXHAUSTED")
      ) {
        cleanMsg = "AI rate limit reached. Please wait a moment before trying again.";
      } else if (
        rawMsg &&
        !rawMsg.includes("[GoogleGenerativeAI Error]") &&
        !rawMsg.includes("http")
      ) {
        cleanMsg = rawMsg;
      }

      setErrorMessage(cleanMsg);
      toast.error(cleanMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedData) return;
    onApplyGeneratedProject(generatedData);
    toast.success("Applied AI project details to form!");
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog animation finishes
    setTimeout(() => {
      setErrorMessage("");
      setGeneratedData(null);
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white border border-gray-200 shadow-xl rounded-2xl">
        <DialogHeader className="gap-1 border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Generate Project with AI
                <span>
                  <LuSparkles className="w-5 h-5 text-primary animate-pulse" />
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Describe what you want in plain English or Hinglish. We will
                convert your thoughts into a structured project draft.
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium text-amber-700 bg-amber-50 border-amber-200 shrink-0 self-start sm:self-center"
            >
              {remainingGenerations !== null
                ? `${remainingGenerations}/3 left today`
                : "Max 3 tries/day"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
            <LuAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Generation Failed</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Prompt Input View */}
        {!generatedData ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  What do you need built? (Raw thoughts)
                </label>
                <span className="text-[11px] text-gray-400">
                  {prompt.length} / 4000
                </span>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: I need someone to build a website for my local clothing business. I need login, product listing, payments and an admin panel. Budget around 50k. I want it done in phases. Someone who knows React and Node would be good."
                className="min-h-[140px] text-sm resize-y border-gray-200 focus-visible:ring-primary/20 text-gray-900  placeholder:text-gray-300 placeholder:font-normal leading-relaxed"
                maxLength={4000}
                disabled={isGenerating}
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <LuLightbulb className="w-3.5 h-3.5 text-amber-500" />
                Quick suggestions you can try:
              </span>
              <div className="flex flex-col gap-1.5">
                {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(suggestion)}
                    className="text-left text-xs p-2 rounded-lg bg-gray-50 hover:bg-primary/5 hover:text-primary border border-gray-200 transition-colors line-clamp-1"
                  >
                    &ldquo;{suggestion}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isGenerating}
                className="text-gray-600 border-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || prompt.trim().length < 5}
                className="bg-primary hover:bg-primaryho text-white font-medium gap-2 min-w-[150px] shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <LuSparkles className="w-4 h-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* STEP 2: Preview Generated Draft View */
          <div className="flex flex-col gap-4 py-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center text-xs text-emerald-800">
              <span className="flex items-center gap-1.5 font-medium">
                <LuCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Draft generated! Review below and apply to populate the form.
              </span>
            </div>

            {/* Generated Summary Card */}
            <div className="space-y-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              {/* Title */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
                  Project Title
                </span>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {generatedData.title}
                </p>
              </div>

              {/* Meta row: Category, Budget, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Category
                  </span>
                  <p className="text-xs font-semibold text-gray-800 capitalize mt-0.5 truncate">
                    {generatedData.projectCategory.replace(/-/g, " ")}
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Estimated Budget
                  </span>
                  <p className="text-xs font-semibold text-primary flex items-center gap-0.5 mt-0.5">
                    <MdOutlineCurrencyRupee />
                    {Number(generatedData.budget).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Timeline
                  </span>
                  <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                    <LuClock className="w-3 h-3 text-gray-400" />
                    {generatedData.duration}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
                  Description
                </span>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed bg-white p-3 rounded-lg border border-gray-200 max-h-36 overflow-y-auto">
                  {generatedData.description}
                </p>
              </div>

              {/* Skills */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
                  Suggested Technologies & Skills (
                  {generatedData.skills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {generatedData.skills?.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary border border-primary/20 text-xs px-2.5 py-0.5 font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1">
                    <GiProgression className="text-primary text-xs" />
                    Generated Milestones (
                    {generatedData.milestones?.length || 0})
                  </span>
                  <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                    Total:{" "}
                    {generatedData.milestones?.reduce(
                      (acc, m) => acc + m.amount,
                      0,
                    )}
                    %
                  </span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {generatedData.milestones?.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-lg border border-gray-200 flex items-start justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {m.title}
                          </p>
                          {m.description && (
                            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 shrink-0">
                        {m.amount}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="text-red-500 bg-transparent hover:bg-transparent hover:text-red-600 hover:font-bold"
              >
                Discard
              </Button>
              <Button
                type="button"
                onClick={handleApply}
                className="bg-primary hover:bg-primaryho text-white font-semibold gap-2 shadow-sm"
              >
                <LuCheck className="w-4 h-4" />
                Populate Form
                <LuArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIProjectGeneratorDialog;
