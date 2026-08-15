"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { MdCurrencyRupee, MdOutlineAccessTime, MdLocationOn, MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { IoCalendarOutline, IoChatbubblesOutline, IoEyeOutline } from "react-icons/io5";
import { LuMilestone } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "@/services/chatRequest";
import { setCurrentChat } from "@/app/(redux)/features/chatDataSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const getCategoryColor = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("web")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (cat.includes("app") || cat.includes("mobile")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (cat.includes("design") || cat.includes("graphic") || cat.includes("ui")) return "bg-purple-50 text-purple-700 border-purple-200";
  if (cat.includes("content") || cat.includes("writing")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (cat.includes("software")) return "bg-cyan-50 text-cyan-700 border-cyan-200";
  if (cat.includes("video")) return "bg-rose-50 text-rose-700 border-rose-200";
  if (cat.includes("marketing") || cat.includes("social")) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const JobCardFreelancer = ({ project, distance = null, isListView = false }) => {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.chatData.userData);
  const senderId = user?.id || user?._id;
  const receiverId = project?.clientId;

  const handleCardClick = () => {
    if (project?._id) {
      router.push(`/fl/jobdetails/${project._id}`);
    }
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast.success(!isSaved ? "Gig saved to your bookmarks!" : "Removed from saved gigs.");
  };

  const handleCreateChat = async (e) => {
    e.stopPropagation();
    if (isChatLoading || !senderId || !receiverId) {
      if (!senderId) {
        toast.error("Please sign in to start a chat.");
      }
      return;
    }
    setIsChatLoading(true);
    try {
      const response = await createChat(senderId, receiverId);
      dispatch(setCurrentChat(response?.data));
      router.push("/fl/chat");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const skillsList = project?.technologies || project?.skills || [];
  const categoryLabel = project?.projectCategory || "General Project";
  const categoryBadgeStyle = getCategoryColor(categoryLabel);
  const milestonesList = project?.milestones || [];

  if (isListView) {
    return (
      <>
        <div
          onClick={handleCardClick}
          className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-primary/50 shadow-xs hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transform-gpu hover:-translate-y-0.5 w-full"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-sky-100 text-primary font-bold text-sm flex items-center justify-center border border-primary/20 shrink-0">
              {project?.clientName ? project.clientName.charAt(0).toUpperCase() : "C"}
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                  {project?.title || "Untitled Project"}
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryBadgeStyle}`}>
                  {categoryLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">
                {project?.description || "No description provided."}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                <span>By {project?.clientName || "Client"}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IoCalendarOutline />
                  {formatTimeAgo(project?.createdAt)}
                </span>
                {distance !== null && distance !== undefined && (
                  <>
                    <span>•</span>
                    <span className="text-sky-600 font-semibold flex items-center gap-0.5">
                      <MdLocationOn />
                      {Number(distance).toFixed(1)} km away
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-xl text-sm">
              <MdCurrencyRupee className="text-sm -mr-0.5" />
              <span>{project?.budget ? Number(project.budget).toLocaleString() : "Negotiable"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="h-8 px-2.5 text-xs rounded-lg border-gray-200 text-gray-600 hover:text-primary"
              >
                <IoEyeOutline className="text-sm mr-1" />
                Quick View
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="h-8 px-3 text-xs bg-primary hover:bg-primaryho text-white rounded-lg"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Quick View Dialog */}
        <QuickViewDialog
          isOpen={isQuickViewOpen}
          setIsOpen={setIsQuickViewOpen}
          project={project}
          categoryBadgeStyle={categoryBadgeStyle}
          categoryLabel={categoryLabel}
          onApply={handleCardClick}
          onChat={handleCreateChat}
          isChatLoading={isChatLoading}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-primary/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer transform-gpu hover:-translate-y-1.5 overflow-hidden w-full h-full"
      >
        {/* Top Ambient Glow Gradient on Hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Main Content Area */}
        <div className="flex flex-col gap-3.5">
          {/* 1. Header: Client Info & Bookmark */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-sky-100 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0 shadow-xs">
                {project?.clientName ? project.clientName.charAt(0).toUpperCase() : "C"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {project?.clientName || "Client"}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <IoCalendarOutline className="text-[10px]" />
                  {formatTimeAgo(project?.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryBadgeStyle}`}>
                {categoryLabel}
              </span>
              <button
                type="button"
                onClick={handleSaveToggle}
                className="text-gray-400 hover:text-primary p-1 transition-colors"
                title={isSaved ? "Unsave Gig" : "Save Gig"}
              >
                {isSaved ? (
                  <MdBookmark className="text-lg text-primary" />
                ) : (
                  <MdBookmarkBorder className="text-lg" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Job Title & Description */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
              {project?.title || "Untitled Project"}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {project?.description || "No description provided for this job."}
            </p>
          </div>

          {/* 3. Skills / Technologies Badges */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {skillsList.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80 px-2 py-0.5 rounded-md transition-colors"
                >
                  {typeof skill === "object" ? skill.label || skill.id : skill}
                </span>
              ))}
              {skillsList.length > 3 && (
                <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                  +{skillsList.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Area: Metrics and Actions */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
          {/* Metrics Row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Budget */}
            <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
              <MdCurrencyRupee className="text-sm -mr-0.5" />
              <span>{project?.budget ? Number(project.budget).toLocaleString() : "Negotiable"}</span>
            </div>

            {/* Duration or Distance */}
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              {distance !== null && distance !== undefined ? (
                <span className="flex items-center gap-1 text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md text-[11px]">
                  <MdLocationOn className="text-xs text-sky-600" />
                  {Number(distance).toFixed(1)} km away
                </span>
              ) : project?.duration ? (
                <span className="flex items-center gap-1 text-[11px]">
                  <MdOutlineAccessTime className="text-xs text-gray-400" />
                  {project.duration}
                </span>
              ) : milestonesList.length > 0 ? (
                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                  <LuMilestone className="text-xs text-primary" />
                  {milestonesList.length} Milestone{milestonesList.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              variant="outline"
              className="h-9 px-2.5 border-gray-200 text-gray-600 hover:text-primary hover:border-primary/40 rounded-xl text-xs font-semibold shadow-xs"
              title="Preview details"
            >
              <IoEyeOutline className="text-base" />
            </Button>

            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="flex-1 bg-primary hover:bg-primaryho text-white text-xs font-semibold py-2 h-9 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 group/btn"
            >
              <span>View & Apply</span>
              <IoIosArrowForward className="text-xs group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isChatLoading}
              onClick={handleCreateChat}
              className="h-9 px-3 border-gray-200 text-gray-700 hover:text-primary hover:border-primary/40 hover:bg-primary/5 rounded-xl shadow-xs transition-colors disabled:opacity-60"
              title="Chat with client"
            >
              {isChatLoading ? (
                <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                <IoChatbubblesOutline className="text-base text-gray-600 group-hover:text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewDialog
        isOpen={isQuickViewOpen}
        setIsOpen={setIsQuickViewOpen}
        project={project}
        categoryBadgeStyle={categoryBadgeStyle}
        categoryLabel={categoryLabel}
        onApply={handleCardClick}
        onChat={handleCreateChat}
        isChatLoading={isChatLoading}
      />
    </>
  );
};

const QuickViewDialog = ({
  isOpen,
  setIsOpen,
  project,
  categoryBadgeStyle,
  categoryLabel,
  onApply,
  onChat,
  isChatLoading,
}) => {
  const skillsList = project?.technologies || project?.skills || [];
  const milestonesList = project?.milestones || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryBadgeStyle}`}>
              {categoryLabel}
            </span>
            <span className="text-xs text-gray-400">
              Posted {formatTimeAgo(project?.createdAt)}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
            {project?.title || "Job Details"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Client: <span className="font-semibold text-gray-800">{project?.clientName || "Verified Client"}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 my-2">
          {/* Budget & Timeline Box */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
            <div>
              <span className="text-[11px] font-medium text-gray-500 block">Total Budget</span>
              <div className="flex items-center font-extrabold text-lg text-emerald-700 mt-0.5">
                <MdCurrencyRupee className="text-lg -mr-1" />
                <span>{project?.budget ? Number(project.budget).toLocaleString() : "Negotiable"}</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 block">Project Duration</span>
              <span className="text-sm font-bold text-gray-800 mt-0.5 block">
                {project?.duration || "Flexible timeline"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
              Project Description
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-gray-100">
              {project?.description || "No full description provided."}
            </p>
          </div>

          {/* Required Skills */}
          {skillsList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-primary/5 text-primary border border-primary/20 px-2.5 py-1 rounded-lg"
                  >
                    {typeof skill === "object" ? skill.label || skill.id : skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Milestones Preview */}
          {milestonesList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Milestones ({milestonesList.length})
              </h4>
              <div className="space-y-2">
                {milestonesList.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200/70 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-gray-800">{m.title || `Milestone ${idx + 1}`}</span>
                    </div>
                    <span className="font-bold text-emerald-700">₹{Number(m.amount || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isChatLoading}
            onClick={onChat}
            className="rounded-xl text-xs font-semibold h-10 px-4 gap-1.5"
          >
            <IoChatbubblesOutline className="text-base" />
            <span>Chat</span>
          </Button>

          <Button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onApply();
            }}
            className="bg-primary hover:bg-primaryho text-white rounded-xl text-xs font-bold h-10 px-6 shadow-xs flex items-center gap-1"
          >
            <span>Apply for Job</span>
            <IoIosArrowForward className="text-xs" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobCardFreelancer;
