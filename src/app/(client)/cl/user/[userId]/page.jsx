"use client";

import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClockIcon, GlobeIcon, StarIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "@/services/chatRequest";
import { setCurrentChat } from "@/app/(redux)/features/chatDataSlice";
import { useRouter } from "next/navigation";
import Loader2 from "@/components/Loader2";
import toast from "react-hot-toast";

const FreelancerProfilePage = () => {
  const skills = [
    "Nextjs",
    "React.js",
    "Node.js",
    "Express.js",
    "Tailwind",
    "MongoDB",
  ];
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  // Get the current URL
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const user = useSelector((state) => state.chatData.userData);
  const receiverId = userId;
  const senderId = user?.id;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathSegments = path.split('/');
      const id = pathSegments[pathSegments.length - 1];
      setUserId(id);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      if (userId) {
        const response = await axios.get(`/api/user/${userId}`);
        if (response.status === 200) {
          setUserData(response.data.user);
          setPortfolioProjects(response.data.user?.portfolioDetails || []);
        } else {
          console.error("Failed to fetch user data");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 />
      </div>
    );
  }

  const router = useRouter();

  const handleCreateChat = async () => {
    if (isChatLoading) return;
    setIsChatLoading(true);
    try {
      const response = await createChat(senderId, receiverId);
      dispatch(setCurrentChat(response?.data));
      router.push("/cl/chat");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  console.log("User: ", userData);
  return (
    <>
      <div className="flex flex-col gap-20 mx-0 md:mx-15">
        <main className="flex-1 w-full">
          <section className="mt-">
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Card className="flex flex-col p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src="/images/user/user-01.png"
                        alt="Freelancer"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{userData?.fullname}</h3>
                      <p className="text-sm text-gray-500">{userData?.professionalTitle}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>San Francisco, USA</span>
                        <span>•</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="bg-primary text-white hover:bg-primaryho">
                      Hire Me
                    </Button>
                    <Button
                      onClick={handleCreateChat}
                      variant="outline"
                      disabled={isChatLoading}
                      className="disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isChatLoading ? (
                        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : (
                        "Chat"
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">About</h4>
                  <p className="text-gray-600">
                    {userData?.bio}
                  </p>
                  {/* <p className="text-gray-600">Years of Experience: 5</p> */}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.skill.map((skill, index) => {
                      return (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      );
                    })}
                    {/* <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                      HTML
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                      CSS
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                      JavaScript
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                      React
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                      Node.js
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                      MongoDB
                    </span> */}
                  </div>
                </div>
                {/* <div className="space-y-2"> */}
                <h4 className="text-lg font-semibold">Portfolio</h4>
                <div className="grid grid-cols-3 gap-4">
                  {portfolioProjects.length > 0 ? (
                    portfolioProjects.map((portfolioProject) => {
                      <div className="rounded-md overflow-hidden">
                        <img
                          src={portfolioProject.imageLink}
                          alt={portfolioProject.title}
                          className="w-full h-full object-cover"
                          width="200"
                          height="150"
                          style={{ aspectRatio: "200/150", objectFit: "cover" }}
                        />
                      </div>
                    })
                  ) : (
                    <div>No Projects</div>
                  )
                  }</div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-500">₹ 500/hr</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">3.67</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">15</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">
                        Ratings & Reviews
                      </h4>
                      <p className="text-gray-500">
                        Average Rating:{" "}
                        <span className="text-purple-600 font-medium">4.7</span>{" "}
                        (15 reviews)
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">Write a Review</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="Client" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">John Doe</span>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <StarIcon className="w-4 h-4 " />
                            <StarIcon className="w-4 h-4" />
                            <StarIcon className="w-4 h-4 text-gray-400" />
                            <StarIcon className="w-4 h-4 text-gray-400" />
                            <StarIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Jefrey is an amazing web developer! He delivered a
                          high-quality website for my business on time and
                          within budget. I highly recommend him.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage
                          src="/images/user/user-02.png"
                          alt="Client"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            Jane Smith
                          </span>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <StarIcon className="w-4 h-4" />
                            <StarIcon className="w-4 h-4" />
                            <StarIcon className="w-4 h-4" />
                            <StarIcon className="w-4 h-4 " />
                            <StarIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-gray-600">
                          I've worked with Jefrey on multiple projects, and he's
                          always been a pleasure to work with. His attention to
                          detail and problem-solving skills are top-notch.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default FreelancerProfilePage;
