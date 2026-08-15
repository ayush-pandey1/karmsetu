"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MdCurrencyRupee, MdAccessTime } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import Loader2 from "@/components/Loader2";
import { getActiveSocket, initGlobalSocket } from "@/services/socketService";

const JobDetails = () => {
  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState();
  const [freelancer, setFreelancer] = useState();
  const [project, setProject] = useState();
  const [userData, setUserData] = useState();
  const [freelancerId, setFreelancerId] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("None"); // 'None' | 'Pending' | 'Accepted' | 'Rejected'
  const [myApplication, setMyApplication] = useState(null);

  const { jobId } = useParams();
  const currentProjectId = Array.isArray(jobId) ? jobId[0] : jobId;

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data);
    const id = data?.id || data?._id;
    if (id) {
      setFreelancerId(id);
    }
  }, []);

  // Fetch application status for this freelancer and project
  const checkApplicationStatus = async (pId, fId) => {
    if (!pId || !fId) return;
    try {
      const res = await fetch(`/api/applicationStore?projectId=${pId}&freelancerId=${fId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.hasApplied && data.application) {
          setMyApplication(data.application);
          const rawStatus = (data.application.applicationStatus || "Pending").toLowerCase();
          if (rawStatus === "accepted") setApplicationStatus("Accepted");
          else if (rawStatus === "rejected") setApplicationStatus("Rejected");
          else setApplicationStatus("Pending");
        } else {
          setMyApplication(null);
          setApplicationStatus("None");
        }
      }
    } catch (err) {
      console.error("Error checking application status:", err);
    }
  };

  // Fetch project data by projectId
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!currentProjectId) return;

        const response = await fetch(`/api/project/${currentProjectId}`);

        if (response.ok) {
          const data = await response.json();
          setJobData(data.project || {});
        } else {
          throw new Error("Failed to load project details");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentProjectId) {
      fetchJobData();
    }
  }, [currentProjectId]);

  // Check application status when both freelancerId and currentProjectId are available
  useEffect(() => {
    if (currentProjectId && freelancerId) {
      checkApplicationStatus(currentProjectId, freelancerId);
    }
  }, [currentProjectId, freelancerId]);

  // Listen for live socket status updates if client accepts or rejects while freelancer is on this page
  useEffect(() => {
    const socket = getActiveSocket() || (freelancerId ? initGlobalSocket(freelancerId) : null);
    if (!socket) return;

    const handleLiveStatus = (data) => {
      if (data?.projectId === currentProjectId) {
        const rawStatus = (data.status || "").toLowerCase();
        if (rawStatus === "accepted") setApplicationStatus("Accepted");
        else if (rawStatus === "rejected") setApplicationStatus("Rejected");
        else setApplicationStatus("Pending");
      }
    };

    socket.on("recieve-application-status", handleLiveStatus);
    return () => {
      socket.off("recieve-application-status", handleLiveStatus);
    };
  }, [currentProjectId, freelancerId]);

  const role = "freelancer";

  // Fetch freelancer details on mount or apply
  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`/api/user/${id}`);
      if (response.status === 200 && response.data?.user) {
        setFreelancer(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response ? error.response.data.message : error.message
      );
      return null;
    }
  };

  useEffect(() => {
    if (freelancerId) {
      fetchUserData(freelancerId);
    }
  }, [freelancerId]);

  async function submitApplication(applicationData) {
    try {
      const response = await fetch("/api/applicationStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to submit application");
      }

      const responseData = await response.json();
      setApplicationStatus("Pending");
      setMessage("");
      toast.success(
        applicationStatus === "Rejected"
          ? "Re-application submitted successfully!"
          : "Application submitted successfully!"
      );

      // Emit live socket event to notify the client in real-time
      const activeSocket = getActiveSocket() || initGlobalSocket(freelancerId);
      if (activeSocket) {
        activeSocket.emit("send-application", {
          clientId: applicationData.clientId,
          freelancerId: applicationData.freelancer?._id || applicationData.freelancer?.id || freelancerId,
          freelancerName: applicationData.freelancer?.fullname || userData?.name || "A freelancer",
          freelancerImage: applicationData.freelancer?.imageLink || userData?.profileImage || "",
          projectTitle: applicationData.project?.title || jobData?.title,
          projectId: applicationData.project?._id || applicationData.project?.id || currentProjectId,
          message: applicationData.message,
        });
      }

      // Refresh application status
      if (currentProjectId && freelancerId) {
        checkApplicationStatus(currentProjectId, freelancerId);
      }

      return responseData;
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application");
      return { error: error.message };
    }
  }

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const onSubmit = async () => {
    if (!message || message.trim() === "") {
      toast.error("Please enter an application message");
      return;
    }

    setIsSubmitting(true);
    try {
      let currentFreelancer = freelancer;
      if (!currentFreelancer && freelancerId) {
        currentFreelancer = await fetchUserData(freelancerId);
      }

      const freelancerPayload = currentFreelancer || {
        _id: userData?.id,
        id: userData?.id,
        fullname: userData?.name || "Freelancer",
        email: userData?.email || "",
        phone: userData?.phone || "",
        professionalTitle: userData?.professionalTitle || "Freelancer",
        skill: userData?.skill || [],
        imageLink: userData?.profileImage || "",
      };

      const projectPayload = jobData || {
        _id: currentProjectId,
        title: jobData?.title || "Project",
        description: jobData?.description || "",
        budget: jobData?.budget || 0,
        status: jobData?.status || "Pending",
      };

      const applicationData = {
        clientId: jobData?.clientId,
        message: message.trim(),
        freelancer: freelancerPayload,
        project: projectPayload,
      };

      const res = await submitApplication(applicationData);
      if (res && !res.error) {
        setIsApplyDialogOpen(false);
      }
    } catch (error) {
      console.error("Submit application error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] p-4 sm:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-5xl shadow-md bg-white border border-gray-200 rounded-xl h-fit">
        <CardHeader className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                {jobData?.title || "Job Details"}
              </CardTitle>
              {applicationStatus === "Rejected" && (
                <p className="text-xs text-amber-700 font-medium mt-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md inline-block">
                  Your previous application was rejected. You can submit a revised proposal.
                </p>
              )}
            </div>

            {role === "freelancer" && (
              <div className="flex items-center gap-3">
                {applicationStatus === "Accepted" ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-lg bg-green-100 text-green-700 font-semibold text-xs sm:text-sm border border-green-200 shadow-xs">
                      Accepted 🎉
                    </span>
                    <a
                      href={`/fl/projectDashboard/${currentProjectId}`}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-xs"
                    >
                      Project Dashboard
                    </a>
                  </div>
                ) : applicationStatus === "Pending" ? (
                  <Button
                    className="bg-gray-100 hover:bg-gray-100 shadow-none text-gray-600 border border-gray-300 px-6 cursor-default"
                    disabled
                  >
                    Applied (Under Review)
                  </Button>
                ) : (
                  <div>
                    <Button
                      className={
                        applicationStatus === "Rejected"
                          ? "bg-amber-600 hover:bg-amber-700 text-white px-6 shadow-sm"
                          : "bg-primary px-6 hover:bg-primaryho shadow-sm"
                      }
                      onClick={() => setIsApplyDialogOpen(true)}
                    >
                      {applicationStatus === "Rejected" ? "Re-Apply for Job" : "Apply"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {/* Application Modal Dialog */}
        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-black flex flex-row gap-1">
                <FaEnvelopeOpenText className="text-primary" />
                {applicationStatus === "Rejected" ? "Submit Revised Application" : "Submit Your Application"}
              </DialogTitle>
              <DialogDescription>
                Craft a personalized message to introduce yourself and highlight why you&apos;re the perfect fit for this project.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor="message" className="sr-only">
                  Application Message
                </Label>
                <Textarea
                  id="message"
                  disabled={isSubmitting}
                  placeholder="Write your application proposal and timeline here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="disabled:opacity-60 disabled:cursor-not-allowed min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-transparent pl-0 text-red-500 shadow-none hover:bg-transparent disabled:opacity-60"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-green-500 focus:bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={onSubmit}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : applicationStatus === "Rejected" ? (
                  "Submit Revised Application"
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CardContent className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaClipboardList className="text-xl text-blue-500" />
              Job Description
            </h2>
            <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-wrap">
              {jobData?.description || "No description provided."}
            </p>
          </div>

          {/* Project Category */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <GiSkills className="text-xl text-purple-500" />
              Project Category
            </h2>
            <p className="mt-2 text-gray-600">{jobData?.projectCategory || "General"}</p>
          </div>

          {/* Required Skills */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <GiSkills className="text-xl text-yellow-500" />
              Required Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {jobData?.technologies && jobData.technologies.length > 0 ? (
                jobData.technologies.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No specific skills listed</span>
              )}
            </div>
          </div>

          {/* Budget and Duration */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <MdCurrencyRupee className="text-2xl text-green-500" />
              <span className="text-gray-800 font-semibold">
                Budget: ₹{jobData?.budget ? jobData.budget.toLocaleString() : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-2xl text-blue-500" />
              <span className="text-gray-800 font-semibold">
                Duration: {jobData?.duration || "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;
