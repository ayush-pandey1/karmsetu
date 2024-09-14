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

const JobDetails = () => {
  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState();
  const [freelancer, setFreelancer] = useState();
  const [project, setProject] = useState();
  const [userData, setUserData] = useState();
  const [isApplied, setisApplied] = useState(false);
  const [freelancerId, setFreelancerId] = useState("");

  const { jobId } = useParams();
  // console.log("id", jobId);

  // if (loading) {
  //   return (
  //     <div className="loading-screen">
  //       <p>Loading...</p>
  //       {/* Optionally add a spinner or more styling */}
  //     </div>
  //   );
  // }

  //To fetch user details from Session Storage
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    console.log(data);
    setUserData(data);
    setFreelancerId(data?.id);
  }, [])

  //To fetch project data by projectId
  
  useEffect(() => {
    // setData();
    const fetchJobData = async () => {
      try {
        if (!jobId) return;

        const response = await fetch(`http://localhost:3000/api/project/${jobId[0]}`);
        if (response.ok) {
          const data = await response.json();
          //console.log("Project Data from MongoDB", data.project);
          setJobData(data.project);
          //console.log(jobData, "Printing State Variable which holds project Details");
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

  const appliedArray = jobData.applied || [] ;
  console.log(appliedArray, "APplied  Freelancer Id");
  console.log(freelancerId, "FreelancerId");
  const hasFreelancerApplied = appliedArray.includes(freelancerId);  // Returns true
  console.log(hasFreelancerApplied, "THis freelancer has applied or not");
  
  useEffect(()=>{
  if(appliedArray.length > 0){
    //console.log("Some Freelancer have applied for this project")
    if(hasFreelancerApplied){
      setisApplied(true);
      console.log("You have already applied for this job");
    }
  }
  }, [isApplied, hasFreelancerApplied])
  // console.log(appliedArray, "It will contain freelancer id who have applied for this project");
  // console.log(jobData, "Printing State Variable which holds project Details, Outiside UseEffect");
  if (loading) return <p>Loading...</p>;

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
      console.error("Error fetching user data:", error.response ? error.response.data.message : error.message);
      return null;
    }
  };

  const fetchProjectData = async (id) => {
    try {
      const response = await axios.get(`/api/project/${id}`);
      console.log(response);
      if (response.status === 200) {
        console.log(response.data.project,"Inside freelance Job Details Page");
        setProject(response.data.project);
        return response.data.project;
      }
    } catch (error) {
      console.error("Error fetching project data:", error.response ? error.response.data.message : error.message);
      return null;
    }
  };
  
  
  async function submitApplication(applicationData) {
    try {
      // Send a POST request to the backend API route
      const response = await fetch('/api/applicationStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting application:', errorData);
        throw new Error(errorData.error || 'Failed to submit application');
      }

      // Parse the response data
      const responseData = await response.json();
      setisApplied(true);
      setMessage("");
      console.log('Application submitted successfully:', responseData);

      // Return the response data
      return responseData;

    } catch (error) {
      console.error('Error:', error);
      return { error: error.message };
    }
  }

  const setData = async () => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    console.log(data, "Data from sessionStorage")
    setUserData(data);
    // console.log("Client id:", jobData?.clientId);
    // console.log("Message: ", message);
    // console.log("Freelancer id: ", data?.id);

    await fetchUserData(data?.id);
    // console.log("Freelancer data: ", freelancer);
    // console.log("Project id: ", jobData?._id);
    await fetchProjectData(jobData?._id);
    //console.log("Project: ", jobData);
  }
  console.log("Project: ", jobData);
  console.log(freelancerId, "Freelancer ID");

  // Modify the onSubmit function
  const onSubmit = async () => {
    setLoading(true);
    // Ensure that data is set before proceeding
    // console.log("Client id:", jobData?.clientId);
    // console.log("Message: ", message);
    // console.log("Freelancer id: ", userData?.id);
    // await fetchUserData(data?.id);
    // console.log("Freelancer data: ", freelancer);
    // console.log("Project id: ", jobData?._id);
    // await fetchProjectData(jobData?._id);
    // console.log("Project: ", project);

    const applicationData = {
      clientId: jobData?.clientId,
      message,
      freelancer,
      project
    };

    await submitApplication(applicationData);
    setLoading(false);
  }





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
                    <Button className="bg-primary  px-6 hover:bg-primaryho " onClick={setData}>
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
                        placeholder="Write your application message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                      onClick={onSubmit}
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
          <Separator/>
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
