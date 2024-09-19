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
        if (!jobId) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${jobId[0]}`);
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

    fetchJobData();
  }, [jobId]);

  if (loading) return (<Loader2 />);

  const role = "client";
  const isApplied = false;
  console.log("DATA", jobData);

  return (
    <div className="container mx-auto md:p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-2">
            {/* <HiOutlineClipboardCheck className="text-2xl text-blue-600" /> */}
            <CardTitle className="text-2xl font-bold text-gray-800">
              {jobData?.title}
            </CardTitle>
            {role === "freelancer" && !isApplied ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <Button className="bg-primary  px-6 hover:bg-primaryho ">
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
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Textarea
                        id="link"
                        placeholder="Write your application message here..."
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-transparent pl-0 text-red-500 shadow-none hover:bg-transparent"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      className="bg-green-500 focus:bg-green-500 hover:bg-green-600"
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : role === "freelancer" && isApplied ? (
              <div>
                <Button className="bg-transparent hover:bg-transparent shadow-none text-green-500 border border-dashed border-green-500  px-6  " disabled>
                  Applied
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaClipboardList className="text-xl text-blue-500" />
              Job Description
            </h2>
            <p className="mt-2 text-gray-600">{jobData?.description}</p>
          </div>

          {/* Project Category */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <GiSkills className="text-xl text-purple-500" />
              Project Category
            </h2>
            <p className="mt-2 text-gray-600">{jobData?.projectCategory}</p>
          </div>

          {/* Required Skills */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <GiSkills className="text-xl text-yellow-500" />
              Required Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {jobData && jobData?.technologies?.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Budget and Duration */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <MdCurrencyRupee className="text-2xl text-green-500" />
              <span className="text-gray-700 font-medium">
                Budget: ₹{jobData?.budget?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-2xl text-blue-500" />
              <span className="text-gray-700 font-medium">
                Duration: {jobData?.duration}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;
