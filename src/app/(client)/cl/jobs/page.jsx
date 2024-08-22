import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";

import React from "react";
import Link from "next/link";
const JobPage = () => {
  return (
    <>
      <div className="font-bold   flex flex-col sm:flex-row gap-2 sm:gap-0  sm:justify-between sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="text-2xl text-black sm:text-4xl">
            All Posted Jobs
          </div>
          <div className="font-medium md:text-base text-sm">
            Review, Manage, and Create New Jobs/Gigs
          </div>
        </div>
        <div className="flex items-center">
          <Button className="flex item-center gap-1 text-white  bg-primary hover:bg-primaryho">
            <Link href="/cl/createjob">Post Job</Link>
            <span className="text-white text-xl">
              <GoPlus />
            </span>
          </Button>
        </div>
      </div>

      <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
    </>
  );
};
export default JobPage;
