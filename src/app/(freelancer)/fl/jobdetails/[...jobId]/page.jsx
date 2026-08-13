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
  const [isApplied, setisApplied] = useState(false);
  const [freelancerId, setFreelancerId] = useState("");

  const { jobId } = useParams();
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data);
    setFreelancerId(data?.id);
  }, []);

  //To fetch project data by projectId
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const id = Array.isArray(jobId) ? jobId[0] : jobId;
        if (!id) return;

        const response = await fetch(`/api/project/${id}`);

        if (response.ok) {
          const data = await response.json();
          setJobData(data.project || {});
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const appliedArray = jobData?.applied || [];
  const hasFreelancerApplied = appliedArray.includes(freelancerId);

  useEffect(() => {
    if (appliedArray.length > 0 && hasFreelancerApplied) {
      setisApplied(true);
    }
  }, [hasFreelancerApplied, appliedArray]);
  // console.log(appliedArray, "It will contain freelancer id who have applied for this project");
  // console.log(jobData, "Printing State Variable which holds project Details, Outiside UseEffect");


  const role = "freelancer";

  //To fetch freelancer details
  const fetchUserData = async (id) => {
    try {
      console.log("Freelancer Id", id);
      const response = await axios.get(`/api/user/${id}`);
      console.log("Freelancer Details", response.data);
      if (response.status === 200) {
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

  const fetchProjectData = async (id) => {
    try {
      const response = await axios.get(`/api/project/${id}`);
      console.log(response);
      if (response.status === 200) {
        console.log(response.data.project, "Inside freelance Job Details Page");
        setProject(response.data.project);
        return response.data.project;
      }
    } catch (error) {
      console.error(
        "Error fetching project data:",
        error.response ? error.response.data.message : error.message
      );
      return null;
    }
  };

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
      setisApplied(true);
      setMessage("");
      toast.success("Application submitted successfully!");
      return responseData;
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to submit application");
      return { error: error.message };
    }
  }

  const setData = async () => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data);

    await fetchUserData(data?.id);
    await fetchProjectData(jobData?._id);
  };

  const onSubmit = async () => {
    if (!message || message.trim() === "") {
      toast.error("Please enter an application message");
      return;
    }

    setIsSubmitting(true);
    try {
      const applicationData = {
        clientId: jobData?.clientId,
        message,
        freelancer,
        project,
      };

      await submitApplication(applicationData);
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
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
              {jobData?.title || "Job Details"}
            </CardTitle>
            {role === "freelancer" && !isApplied ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <Button
                      className="bg-primary px-6 hover:bg-primaryho"
                      onClick={setData}
                    >
                      Apply
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-black flex flex-row gap-1">
                      <FaEnvelopeOpenText className="text-primary" />
                      Submit Your Application
                    </DialogTitle>
                    <DialogDescription>
                      Craft a personalized message to introduce yourself and
                      highlight why you're the perfect fit for this project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Textarea
                        id="link"
                        disabled={isSubmitting}
                        placeholder="Write your application message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="disabled:opacity-60 disabled:cursor-not-allowed"
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
                        Close
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
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : role === "freelancer" && isApplied ? (
              <div>
                <Button
                  className="bg-transparent hover:bg-transparent shadow-none text-green-500 border border-dashed border-green-500 px-6"
                  disabled
                >
                  Applied
                </Button>
              </div>
            ) : null}
          </div>
        </CardHeader>
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
