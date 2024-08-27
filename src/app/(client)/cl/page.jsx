"use client";

import FreelancerCard from "@/components/FreelancerCard";
import JobCardClient from "@/components/JobCardClient";
import JobCardFreelancer from "@/components/JobCardFreelancer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
const Home = () => {
  const [userData, setUserData] = useState();
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);

  }, [])
  const user = userData?.name;
  const userId = userData?.id;
  // console.log(userId);
  return (
    <>
      <div className="flex flex-col gap-12 mx-0 sm:mx-8 mt-5">
        <div className="flex  flex-col sm:flex-row gap-4 sm:gap-0  sm:justify-between sm:items-center">
          <span className="font-semibold text-black text-4xl">
            Welcome Back, <span className="text-primary">{user}</span> 👋
          </span>
          <div className="flex items-center">
            <Button className="flex item-center gap-1 text-white  bg-primary hover:bg-primaryho">
              <Link href="/cl/createjob">Post Job</Link>
              <span className="text-white text-xl">
                <GoPlus />
              </span>
            </Button>
          </div>
        </div>

        <div className=" w-full rounded-lg "> {/* Quick Stats Section */}
          <div className="grid gap-4  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pt-4 pb-0  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-xl md:text-2xl  font-semibold">
                  Total Projects Posted
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5  text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-xs pt-2 text-gray-400">
                  last posted on 27 July
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pt-4 pb-0  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-xl md:text-2xl  font-semibold">
                  Active Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">5</div>
                <p className="text-xs pt-2 text-gray-400">
                  Updated on 10 August
                </p>
              </CardContent>
            </Card>
            <Card className="hidden lg:block">
              <CardHeader className="pt-4 pb-0  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-xl md:text-2xl  font-semibold">
                  Completed Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">7</div>
                <p className="text-xs pt-2 text-gray-400">
                  Updated on 10 August
                </p>
              </CardContent>
            </Card>
            <Card className="hidden lg:block">
              <CardHeader className="pt-4 pb-0  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-xl md:text-2xl  font-semibold">
                  Total Hired Freelancers
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">8</div>
                <p className="text-xs pt-2 text-gray-400">
                  Last hire on 20 July
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-2   w-full  rounded-lg">
          <div className="md:text-4xl text-3xl text-black font-semibold">
            Freelancers
          </div>
          <div className=" inline-flex flex-row flex-wrap  justify-start   gap-4">
            <FreelancerCard />
            <FreelancerCard />
            <FreelancerCard />
            <FreelancerCard />
            <FreelancerCard />
            <FreelancerCard />

            <FreelancerCard />
          </div>
        </div>
        {/* <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
        <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
        <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
        <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div> */}
      </div>
    </>
  );
};

export default Home;
