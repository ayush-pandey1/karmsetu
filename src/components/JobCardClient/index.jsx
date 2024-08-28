"use client";

import React from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const JobCardClient = ({ length, projects }) => {
  return (
    <>
      {length && Array.isArray(projects) && projects.length > 0 ? (
        projects.map((project) => (
          <div key={project?.id}>
            <div className="p-4 border border-slate-300 max-w-72 sm:max-w-90 rounded-lg">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                  <div>
                    <span className="text-xs font-medium flex flex-row gap-1">
                      assigned to
                      <p className="text-blue-500 cursor-pointer">alex734</p>
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
                    <Link href={`/cl/jobdetails/${project?._id}`} >
                      <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                        Details <IoIosArrowForward className="text-white text-base" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-row gap-6 text-sm items-center">
                  <span className="sm:text-sm text-sm text-red-500 font-semibold">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button>Delete</button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Job</DialogTitle>
                          <DialogDescription>
                            Please enter the{" "}
                            <span className="text-red-500">"{project?.title}"</span> exactly to confirm deletion.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="">
                            <Input
                              id="name"
                              value=""
                              className="col-span-3 placeholder:text-gray-400 font-inter"
                              placeholder="Enter the title"
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex justify-center">
                          <DialogClose asChild>
                            <Button type="submit" variant="destructive">
                              Delete Job
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </span>
                  <span className="flex flex-row gap-1 items-center sm:text-sm text-xs">
                    Status: <p className="text-orange-400">{project?.status}</p>
                  </span>
                  <span className="sm:text-sm text-xs">27 July</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No Projects</div>
      )}
    </>
  );
};

export default JobCardClient;
