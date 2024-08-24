import React from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { FiCircle } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import Link from "next/link";
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
import { Label } from "@/components/ui/label";

const JobCardClient = () => {
  const title = "An Ecommerce Website For Shoe Store";
  return (
    <div>
      <div className="p-4 border border-slate-300 max-w-72 sm:max-w-90 rounded-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-xs font-medium flex flex-row gap-1">
                assigned to
                <p className="text-blue-500 cursor-pointer ">alex734</p>
              </span>
              <div className="text-black text-base sm:text-lg font-bold leading-tight">
                This is the Job Title
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium line-clamp-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Vitae quidem aliquam voluptatibus excepturi, dignissimos
                  molestiae esse velit harum culpa, dolor omnis? Dolores
                  explicabo iure voluptas rem quibusdam laborum! Consequatur,
                  neque.
                </p>
              </div>
            </div>
            <div>
              <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                Details <IoIosArrowForward className="text-white text-base" />
              </Button>{" "}
            </div>
          </div>
          <div className="flex flex-row gap-6  text-sm  items-center font-">
            <span className=" sm:text-sm text-sm  text-red-500 font-semibold">
              <Dialog className="">
                <DialogTrigger asChild>
                  <button>Delete</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Job</DialogTitle>
                    <DialogDescription>
                      Please enter the{" "}
                      <span className="text-red-500">"{title}"</span> exactly to
                      confirm deletion.
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
                      <Button type="submit " variant="destructive">
                        Delete Job
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </span>
            <span className="flex flex-row gap-1 items-center   sm:text-sm text-xs">
              Status:<p className="text-orange-400">Ongoing</p>
            </span>
            <span className=" sm:text-sm text-xs">27 July</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardClient;
