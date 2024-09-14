"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const Header = () => {
  const [imgLink, setImgLink] = useState("");

  //To get user details from sessionStorage
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    if (data) {
      try {
        console.log(data, "User data from session");
        setImgLink(data?.profileImage);
      } catch (error) {
        console.error("Invalid session storage data", error);
      }
    }
  }, []);

  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-200 bg-white": selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex flex-row items-center space-x-4">
          <Link
            href="/cl"
            className="flex flex-row items-center justify-center space-x-1 md:hidden"
          >
            <span className="rounded-lg">
              {" "}
              <Image
                src="/karmsetu.png"
                className=""
                width="35"
                height="35"
                alt="gov punjab"
              />{" "}
            </span>
            {/* <span className="flex text-xl font-bold ">Karmsetu</span> */}
            <span className="flex w-32">
              <Image
                src="/images/karmsetuLogo-cropped.svg"
                width="0"
                height="0"
                className="w-auto h-auto"
                alt="karmsetu logo"
              />
            </span>
          </Link>
        </div>

        <div className="hidden md:block h-full">
          
          <div className="flex flex-row w-full items-center h-full opacity-90">
            <Image
              alt="Profile Image"
              src="/min-edu.png"
              className=" w-20 object-contain "
              height="0"
              width="0"
              unoptimized
            />
            <span className="h-full py-2 pl-2 pr-1">
            <Separator orientation="vertical" className="" />
            </span>
           
            <Image
              alt="Profile Image"
              src="/sih-logo.png"
              className=" w-27 object-contain "
              height="0"
              width="0"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
