import CreateJobForm from "@/components/CreateJob";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
// import { Button } from "../../../../components/ui/button";
// import CreateJobForm from "../../../../components/CreateJob/index";
import React from "react";

const CreateJob = () => {
  return (
    <>
      <div className="flex flex-col gap-10  mx-0 sm:mx-15">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold  text-primaryho sm:text-4xl">
            Create a New Job
          </span>
          <span className="font-medium md:text-base text-sm">
            Provide detailed information to create a job/gig.
          </span>
        </div>

        <div className="sm:px-10 sm:py-4 sm:border sm:border-slate-300 rounded-2xl ">
          <CreateJobForm/>
        </div>
      </div>
    </>
  );
};
export default CreateJob;
