import Image from "next/image";
import React from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { RiSuitcaseLine } from "react-icons/ri";
import { Button } from "../ui/button";
const FreelancerCard = () => {
  return (
    <div className="p-4 flex flex-col gap-4 shadow-sm border border-gray-300  w-72 rounded-xl">
      <div className="flex flex-row items-center gap-5">
        <Image src="/images/user/user-02.png" height="45" width="45" />
        <div className="flex flex-col">
          <span className="text-black text-lg font-medium">Jefrey Dhamer</span>
          <span className="text-xs">Web Developer</span>
        </div>
      </div>
      <div>
        <span className="line-clamp-4 text-black font-medium text-md">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse ea
          magni vero harum incidunt nulla repellendus reiciendis excepturi!
          Explicabo quisquam exercitationem esse vel aliquid ea tempore deleniti
          aspernatur nihil dolorum.
        </span>
      </div>
      <div className="flex flex-row  justify-between">
        <div className="flex flex-row items-center"><MdOutlineCurrencyRupee /> 500/hr</div>
        <div className="flex flex-row items-center gap-1"><FaRegStar /> 3.67</div>
        <div className="flex flex-row items-center gap-1"><RiSuitcaseLine className="text-xl"/> 15</div>
      </div>
      <div className="flex flex-col gap-2">
        <Button className="w-full bg-primary hover:bg-primaryho shadow-none" >View Profile</Button>
        <Button className="w-full shadow-none text-secondaryho bg-transparent hover:bg-transparent border border-double border-secondaryho" >Chat</Button>
      </div>
    </div>
  );
};

export default FreelancerCard;
