import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { FiCircle } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import { IoCalendarOutline } from "react-icons/io5";

const JobCardFreelancer = ({ project }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  console.log("Id1: ", project);
  return (
    <div>
      <div className="p-4 border  border-slate-300 shadow-md bg-white max-w-72  sm:max-w-90 rounded-xl h-full w-full">
        <div className="flex flex-col gap-2  sm:gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3  sm:gap-4">
            <div>
              <span className="text-xs font-medium flex flex-row gap-1">
                Posted by
                <p className="text-blue-500 cursor-pointer ">
                  {project?.clientId}
                </p>
              </span>
              <div className="text-black text-base sm:text-lg font-bold leading-tight">
                {project?.title}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium line-clamp-3">
                  {project?.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-col gap-4 sm:gap-4 text-sm   font- ">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row ">
                <span className="flex flex-row gap-1 items-center  w-50 sm:w-55 sm:text-sm text-xs">
                  <FiCircle className="text-xs text-primary font-bold" /> 
                  {project?.projectCategory}
                </span>
                <span className="flex flex-row sm:text-sm text-xs items-center text-green-500">
                  <span className="text-black font-semibold">Budget:</span>
                  <MdCurrencyRupee />
                  {project?.budget}
                </span>
              </div>
              <span className=" sm:text-sm text-xs w-full  flex flex-row items-center gap-1 ">
                <IoCalendarOutline className="text-primary font-bold" />
                Posted {formatDate(project?.createdAt)}
              </span>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <Link href={`/fl/jobdetails/${project?._id}`} className="w-full">
                <Button className="flex flex-row mt-0 w-full items-center bg-primary active:bg-primaryho hover:bg-primary shadow-none">
                  Details
                </Button>
              </Link>
              <Link href="/fl" className="w-full">
                <Button className="flex flex-row mt-0 text-black w-full items-center bg-transparent active:bg-transparent hover:bg-transparent  border border-gray-300 shadow-none">
                  Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardFreelancer;
