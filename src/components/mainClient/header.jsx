"use client";
import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
const Header = () => {
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

        <div className="hidden md:block">
          <div className="flex items-center justify-center w-8 h-8 text-center rounded-full bg-zinc-300">
            <span className="text-sm font-semibold">HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
