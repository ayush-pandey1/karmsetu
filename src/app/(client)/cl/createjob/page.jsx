"use client";

import CreateJobForm from "@/components/CreateJob";
import React from "react";

const CreateJob = () => {
  return (
    <div className="flex flex-col gap-6 mx-3 sm:mx-12 mt-5 mb-12">
      <div className="flex flex-col gap-1">
        <span className="text-2xl text-black sm:text-3xl px-3 border-l-4 border-l-secondary font-bold">
          Create a New Job
        </span>
        <span className="font-medium text-gray-500 md:text-sm text-xs pl-3">
          Provide detailed information to post a new project or gig.
        </span>
      </div>

      <div className="p-4 sm:p-8 border border-gray-200 bg-white rounded-xl shadow-xs">
        <CreateJobForm />
      </div>
    </div>
  );
};

export default CreateJob;

