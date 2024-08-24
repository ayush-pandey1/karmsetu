import React from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { FiCircle } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";

const JobCardFreelancer = ({ jobData }) => {
  const user = "alex438";
  const title = "An Ecommerce Website For Shoe Store";
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime quis beatae dolore rerum saepe! Illum aut totam voluptatum. Sapiente voluptates eos ea consequatur vitae iusto dolorum maiores architecto asperiores cumque.";
    const jobCategory = "Web Development"
    const budget = 6800;
    const date = "April 27"
  return (
    <div>
      <div className="p-4 border border-slate-300 max-w-72 sm:max-w-90 rounded-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-xs font-medium flex flex-row gap-1">
                Posted by
                <p className="text-blue-500 cursor-pointer ">{user}</p>
              </span>
              <div className="text-black text-base sm:text-lg font-bold leading-tight">
                {title}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium line-clamp-4">
                  {description}
                </p>
              </div>
            </div>
            <div>
              <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                Details <IoIosArrowForward className="text-white text-base" />
              </Button>{" "}
            </div>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4 text-sm  items-center font-">
            <span className="flex flex-row gap-1 items-center  w-50 sm:w-55 sm:text-sm text-xs">
              <FiCircle className="text-xs text-primary" />
              {jobCategory}
            </span>
            <span className="flex flex-row items-center text-green-500">
              <MdCurrencyRupee />
              {budget}
            </span>
            <span className=" sm:text-sm text-xs w-25 sm:w-40">Posted {date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardFreelancer;
