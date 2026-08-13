"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MdCurrencyRupee, MdAccessTime } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { GiSkills } from "react-icons/gi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
import Loader2 from "@/components/Loader2";

const JobDetails = () => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { jobId } = useParams();
  console.log("id", jobId);
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const id = Array.isArray(jobId) ? jobId[0] : jobId;
        if (!id) return;

        const response = await fetch(`/api/project/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJobData(data.project);
          return;
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error('Failed to fetch job data');
        }
        setJobData(data.project || {});
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 />
      </div>
    );
  }

  const role = "client";
  const isApplied = false;
  console.log("DATA", jobData);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] p-4 sm:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-5xl shadow-md bg-white border border-gray-200 rounded-xl h-fit">
        <CardHeader className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
              {jobData?.title || "Job Details"}
            </CardTitle>
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
