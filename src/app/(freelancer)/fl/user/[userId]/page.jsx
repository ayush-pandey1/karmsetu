"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClockIcon, GlobeIcon, StarIcon } from "@radix-ui/react-icons";
import axios from "axios";
import Loader2 from "@/components/Loader2";
import { SiHyperskill } from "react-icons/si";
import { BiSolidUserDetail } from "react-icons/bi";
import { useSelector } from "react-redux";

const FreelancerProfilePage = () => {
  const skills = [
    "Nextjs",
    "React.js",
    "Node.js",
    "Express.js",
    "Tailwind",
    "MongoDB",
  ];
  const path = window.location.pathname;
  const pathSegments = path.split("/");
  const userId = pathSegments[pathSegments.length - 1];

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const user = useSelector((state) => state.chatData.userData);
  // console.log("User by redux: ", user);

  useEffect(() => {
    if (!userId) return; // Exit early if userId is not available

    const fetchUserData = async () => {
      const data = JSON.parse(sessionStorage.getItem("karmsetu"));
      // console.log(data);
      // setUserData(data);
      try {
        const response = await axios.get(`/api/user/${data.id}`);
        setUserData(response.data.user);
        // console.log("data-redux: ", response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Ensure loading state is updated even if there's an error
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    console.log("userwisedata: ", userData);
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 />
      </div>
    );
  }

  //console.log("User: ", userData);

  return (
    <>
      <div className="flex flex-col gap-20 mx-0 ">
        <main className="flex-1 w-full">
          <section className="mt-">
            <div className="grid grid-cols-1 gap-4 ">
              <Card className="flex flex-col p-4 space-y-4 rounded-none ">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                  <div className="flex items-center space-x-4">
                    <Avatar className="rounded-xl h-15 w-15">
                      <AvatarImage
                        // src={userData?.profileImage}
                        src="https://res.cloudinary.com/dya4imi67/image/upload/v1726067570/p5i2zikqfy89xnanrgro.jpg"
                        alt="Freelancer"

                      />
                      <AvatarFallback>PFP</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">
                        {userData?.fullname}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userData?.professionalTitle}
                      </p>
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
                    <Button variant="outline">Chat</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold flex flex-row gap-1 items-center"><BiSolidUserDetail className="text-blue-500" />About</h4>
                  <p className="text-gray-600">{userData?.bio}</p>
                  {/* <p className="text-gray-600">Years of Experience: 5</p> */}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold flex flex-row gap-1 items-center"> <SiHyperskill className="text-green-500" />Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.skill.map((skill, index) => {
                      return (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Portfolio</h4>

                  <div className="flex flex-col gap-4">
                    {/* Mapping through portfolioDetails */}
                    {userData.portfolioDetails.map((portfolio, index) => (
                      <div key={index} className="rounded-lg overflow-hidden flex flex-col bg-white border border-gray-200 p-4 gap-4">
                        {/* Project Title */}
                        <span className="text-md sm:text-lg lg:text-2xl text-black font-bold">
                          {portfolio.title}
                        </span>

                        {/* Project Description */}
                        <span className="text-gray-400 text-xs sm:text-base text-justify">
                          {portfolio.description}
                        </span>

                        {/* Tags */}
                        <div className="flex flex-row gap-2 items-center overflow-x-scroll no-scrollbar">
                          {portfolio.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-blue-100 text-blue-600 border border-blue-600 sm:px-3 px-2 py-1 rounded-full w-fit"
                            >
                              <p className="text-xs sm:text-md">{tag}</p>
                            </span>
                          ))}
                        </div>

                        {/* Project Image */}
                        {portfolio.imageLink && (
                          <img
                            src={portfolio.imageLink}
                            alt={`Project ${index + 1}`}
                            className="h-auto w-full rounded-lg aspect-auto"
                            width="0"
                            height="0"
                          />
                        )}
                      </div>
                    ))}
                    {/* </div> */}


                    {/* <div className="rounded-lg overflow-hidden flex flex-col bg-white border border-gray-200 p-4 gap-4">
                      <span className="text-md sm:text-lg lg:text-2xl text-black font-bold">
                        {"Project Title"}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-base text-justify">
                        {
                          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt eos consequuntur similique dolor vel non adipisci excepturi modi animi temporibus cum amet illum enim unde minus voluptatem, provident eveniet laboriosam consequatur et?"
                        }
                      </span>
                      <div className="flex flex-row gap-2 items-center overflow-x-scroll no-scrollbar">
                        <span className="bg-blue-100 text-blue-600 border border-blue-600 sm:px-3 px-2 py-1 rounded-full w-fit">
                          <p className="text-xs sm:text-md">{"Next.js"}</p>
                        </span>
                        <span className="bg-blue-100 text-blue-600 border border-blue-600 sm:px-3 px-2 py-1 rounded-full w-fit">
                          <p className="text-xs sm:text-md">{"Next.js"}</p>
                        </span>
                        <span className="bg-blue-100 text-blue-600 border border-blue-600 sm:px-3 px-2 py-1 rounded-full w-fit">
                          <p className="text-xs sm:text-md">{"Next.js"}</p>
                        </span>
                        <span className="bg-blue-100 text-blue-600 border border-blue-600 sm:px-3 px-2 py-1 rounded-full w-fit">
                          <p className="text-xs sm:text-md">{"Next.js"}</p>
                        </span>
                        <span className="bg-blue-100 text-blue-600 border border-blue-600 sm:px-3 px-2 py-1 rounded-full w-fit">
                          <p className="text-xs sm:text-md">{"Next.js"}</p>
                        </span>
                      </div>
                      <img
                        src="/images/portfolio/portfolio1.jpg"
                        alt="Project 1"
                        className="h-auto w-full rounded-lg  aspect-auto"
                        width="0"
                        height="0"

                      />

                    </div> */}



                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-500">
                      ₹ 500/hr
                    </span>
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
