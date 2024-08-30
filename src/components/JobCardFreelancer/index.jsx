import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { FiCircle } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import Link from "next/link";
import axios from 'axios';

const JobCardFreelancer = ({ project }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  console.log("Id1: ", project);
  return (
    <div>
      <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-xs font-medium flex flex-row gap-1">
                Posted by
                <p className="text-blue-500 cursor-pointer ">{project?.clientId}</p>
              </span>
              <div className="text-black text-base sm:text-lg font-bold leading-tight">
                {project?.title}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium line-clamp-4">
                  {project?.description}
                </p>
              </div>
            </div>
            <div>
              <Link href={`/fl/jobdetails/${project?._id}`} >
                <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                  Details <IoIosArrowForward className="text-white text-base" />
                </Button>{" "}
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4 text-sm  items-center font-">
            <span className="flex flex-row gap-1 items-center  w-50 sm:w-55 sm:text-sm text-xs">
              <FiCircle className="text-xs text-primary" />
              {project?.projectCategory}
            </span>
            <span className="flex flex-row items-center text-green-500">
              <MdCurrencyRupee />
              {project?.budget}
            </span>
            <span className=" sm:text-sm text-xs w-25 sm:w-40">Posted {formatDate(project?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardFreelancer;
