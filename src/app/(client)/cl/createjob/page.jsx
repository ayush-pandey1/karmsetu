"use client";

import CreateJobForm from "@/components/CreateJob";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import React from "react";

const CreateJob = () => {
  return (
    <>
      <div className="flex flex-col gap-10  mx-4 sm:mx-15 mt-5 ">
        <div className="flex flex-col gap-1">
          <span className="text-2xl   text-black sm:text-4xl px-3  border-l-4 border-l-secondary font-bold">
            Create a New Job
          </span>
          <span className="font-medium md:text-base text-sm">
            Provide detailed information to create a job/gig.
          </span>
        </div>

        <div className="sm:px-10 sm:py-4 sm:border sm:border-slate-300 bg-white mb-2 rounded-lg ">
          <CreateJobForm/> 
        </div>
      </div>
    </>
  );
};
export default CreateJob;
