"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, StarIcon } from "@radix-ui/react-icons";
import { IoChatbubblesOutline, IoCalendarOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaClipboardList } from "react-icons/fa";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({}); // To track each application's status

  // useEffect(() => {
  //   console.log(status);
  // }, [status])


  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    if (data?.id) {
      fetchApplications(data.id);
    }
  }, []);

  const fetchApplications = async (id) => {
    try {
      const res = await fetch(`/api/application/${id}`);
      const result = await res.json();
      if (res.ok) {
        setApplications(result.applications);
        //console.log("Application data fetched");
      } else {
        console.error(result.message);
        //console.log("Application data not fetched");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the accept click
  const handleStatus = async (appId, projectId, freelancerId, newStatus) => {
    try {
      // Update the status immediately for the button change
      //console.log(newStatus, freelancerId);
  
      setStatus((prev) => ({ ...prev, [appId]: newStatus }));
      //console.log(JSON.stringify({ freelancerId, newStatus }), "Converting JS to JSON");
      const response = await fetch(`/api/applicationAccepted/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ freelancerId, newStatus })
      });
      //console.log("Put Request API called");
      const data = await response.json();
      //console.log("data: ", data);
      
      if (!data.success) {
        // If API fails, reset the button status
        setStatus((prev) => ({ ...prev, [appId]: null }));
        console.error("Failed to accept the application");
      }
    } catch (error) {
      // Handle error and reset the button status
      setStatus((prev) => ({ ...prev, [appId]: null }));
      console.error("Error accepting application:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      <div className="flex min-h-screen">
        <main className="flex-1 sm:px-6 bg-gray-50 rounded-xl">
          <section className="mt-8">
            <span className="flex flex-row items-center gap-1 text-2xl mb-4">
              <FaClipboardList className="text-green-500 text-xl" />
              <p className="font-bold text-black">Freelancer Applications</p>
            </span>

            {applications.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="bg-white p-4 rounded-xl shadow-sm flex lg:flex-row flex-col gap-3 justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2">
                        <Avatar>
                          <Link href={`/fl/user/${app.freelancer?.email}`}>
                            <AvatarImage src="/images/user/user-02.png" alt="Freelancer" />
                          </Link>
                          <AvatarFallback>{app.freelancer?.fullname?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg sm:text-xl text-black font-semibold">
                            <Link href={`/cl/user/${app.freelancer?.id}`}>{app.freelancer?.fullname}</Link>
                          </h3>
                          <p className="text-gray-500 text-sm">{app.freelancer?.professionalTitle}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm">
                          Project:{" "}
                          <span className="text-blue-500">
                            <Link href={`/cl/jobdetails/${app.project?.id}`}>
                              {app.project?.title}
                            </Link>
                          </span>
                        </span>
                        <p className="text-xs sm:text-sm text-black">{app.message}</p>
                        <div className="flex flex-row gap-4 text-sm sm:text-md">
                          <div className="flex flex-row gap items-center">
                            <MdOutlineCurrencyRupee className="w-5 h-5 text-green-500" />
                            {app.project?.budget}
                            /h

                          </div>
                          <div className="flex flex-row gap-1 items-center">
                            <StarIcon className="w-5 h-5 text-yellow-500" />
                            4.5
                          </div>
                        </div>
                        <div className="flex flex-row gap-1 items-center text-gray-500 text-sm sm:text-md">
                          <IoCalendarOutline className="text-primary text-lg" />
                          <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {app.applicationStatus === "accepted" ? (
                        <Button variant="success" className="bg-green-500 text-white" disabled>Accepted</Button>
                      ) : app.applicationStatus === "rejected" ? (
                        <Button variant="destructive" disabled>Rejected</Button>
                      ) : (
                        <>
                          <Button
                            variant="accept"
                            className="flex items-center space-x-2 px-3 sm:px-4"
                            onClick={(event) => handleStatus(app._id, app.project?.id, app.freelancer?.id, 'accepted', event)}
                            name = "accept"
                          >
                            <CheckIcon className="w-5 h-5" />
                            <span>Accept</span>
                          </Button>
                          <Button
                            variant="destructive"
                            name = 'reject'
                            className="flex items-center space-x-2 px-3 sm:px-4"
                            onClick={(event) => handleStatus(app._id, app.project?.id, app.freelancer?.id, 'rejected', event)}
                          >
                            <RxCross2 className="w-5 h-5" />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}
                      <Button variant="outline" className="flex items-center space-x-2 px-3 sm:px-4">
                        <IoChatbubblesOutline className="w-5 h-5" />
                        <span>Chat</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ApplicationsPage;
