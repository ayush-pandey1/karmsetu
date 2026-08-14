"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, StarIcon } from "@radix-ui/react-icons";
import { IoChatbubblesOutline, IoCalendarOutline } from "react-icons/io5";
import { SlRefresh } from "react-icons/sl";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaClipboardList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createChat } from "@/services/chatRequest";
import { setCurrentChat } from "@/app/(redux)/features/chatDataSlice";
import Loader2 from "@/components/Loader2";
import toast from "react-hot-toast";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [processingAppId, setProcessingAppId] = useState(null);
  const [chatLoadingId, setChatLoadingId] = useState(null);

  const [senderId, setSenderId] = useState();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chatData.userData);
  useEffect(() => {
    setSenderId(user?.id);
  }, [user]);

  const router = useRouter();

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
        setApplications(result.applications || []);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the accept/reject click
  const handleStatus = async (appId, projectId, freelancerId, newStatus) => {
    setProcessingAppId(appId);
    try {
      setStatus((prev) => ({ ...prev, [appId]: newStatus }));
      const response = await fetch(`/api/applicationAccepted/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ freelancerId, newStatus }),
      });
      const data = await response.json();

      if (!data.success) {
        setStatus((prev) => ({ ...prev, [appId]: null }));
        console.error("Failed to update application status", data);
        toast.error(data.message || `Failed to ${newStatus} application`);
      } else {
        setStatus((prev) => ({ ...prev, [appId]: newStatus }));
        toast.success(
          `Application ${newStatus === "accepted" ? "accepted" : "rejected"} successfully!`,
        );
        handleRefresh();
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, [appId]: null }));
      console.error("Error updating application:", error);
      toast.error(error.message || `Error updating application status`);
    } finally {
      setProcessingAppId(null);
    }
  };

  //Function to handle refresh
  const handleRefresh = () => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    if (data?.id) {
      fetchApplications(data.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 />
      </div>
    );
  }

  const handleCreateChat = async (receiverId) => {
    setChatLoadingId(receiverId);
    try {
      const response = await createChat(senderId, receiverId);
      dispatch(setCurrentChat(response?.data));
      router.push("/cl/chat");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setChatLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex min-h-screen">
        <main className="flex-1 sm:px-6 bg-gray-50 rounded-xl">
          <section className="mt-8">
            <span className="flex flex-row items-center justify-center gap-1 text-2xl mb-4">
              <FaClipboardList className="text-green-500 text-xl" />
              <p className="font-bold text-black">Freelancer Applications</p>
              <button
                onClick={handleRefresh}
                className="text-5xl  text-green-500 font-semibold px-2 py-2 rounded-full ml-4"
              >
                <SlRefresh className="size-6 text-green-500  hover:cursor-pointer" />
              </button>
            </span>

            {applications.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white p-4 rounded-xl shadow-sm flex lg:flex-row flex-col gap-3 justify-between"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2">
                        <Avatar>
                          <Link href={`/fl/user/${app.freelancer?.email}`}>
                            <AvatarImage
                              src={
                                app.freelancer.imageLink
                                  ? app.freelancer.imageLink
                                  : "/images/user/user-02.png"
                              }
                              alt="Freelancer"
                            />
                          </Link>
                          <AvatarFallback>
                            {app.freelancer?.fullname?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg sm:text-xl text-black font-semibold">
                            <Link href={`/cl/user/${app.freelancer?.id}`}>
                              {app.freelancer?.fullname}
                            </Link>
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {app.freelancer?.professionalTitle}
                          </p>
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
                        <p className="text-xs sm:text-sm text-black">
                          {app.message}
                        </p>
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
                          <p>
                            Applied on:{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {app.applicationStatus === "accepted" ? (
                        <Button
                          variant="success"
                          className="bg-green-500 text-white"
                          disabled
                        >
                          Accepted
                        </Button>
                      ) : app.applicationStatus === "rejected" ? (
                        <Button variant="destructive" disabled>
                          Rejected
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="accept"
                            disabled={processingAppId === app._id}
                            className="flex items-center space-x-2 px-3 sm:px-4 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() =>
                              handleStatus(
                                app._id,
                                app.project?.id,
                                app.freelancer?.id,
                                "accepted",
                              )
                            }
                            name="accept"
                          >
                            {processingAppId === app._id &&
                            status[app._id] === "accepted" ? (
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
                            ) : (
                              <CheckIcon className="w-5 h-5" />
                            )}
                            <span>Accept</span>
                          </Button>
                          <Button
                            variant="destructive"
                            name="reject"
                            disabled={processingAppId === app._id}
                            className="flex items-center space-x-2 px-3 sm:px-4 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() =>
                              handleStatus(
                                app._id,
                                app.project?.id,
                                app.freelancer?.id,
                                "rejected",
                              )
                            }
                          >
                            {processingAppId === app._id &&
                            status[app._id] === "rejected" ? (
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
                            ) : (
                              <RxCross2 className="w-5 h-5" />
                            )}
                            <span>Reject</span>
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        disabled={chatLoadingId === app.clientId}
                        className="flex items-center space-x-2 px-3 sm:px-4 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleCreateChat(app.clientId)}
                      >
                        {chatLoadingId === app.clientId ? (
                          <svg
                            className="animate-spin h-4 w-4 text-primary"
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
                        ) : (
                          <IoChatbubblesOutline className="w-5 h-5" />
                        )}
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
