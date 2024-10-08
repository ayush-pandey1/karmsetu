import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { FiCircle } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import { IoCalendarOutline } from "react-icons/io5";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "@/services/chatRequest";
import { setCurrentChat } from "@/app/(redux)/features/chatDataSlice";
import { useRouter } from "next/navigation";

const JobCardFreelancer = ({ project }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const clientImageLink = project?.clientImageLink;
  const user = useSelector((state) => state.chatData.userData);
  const senderId = user?.id;
  const receiverId = project?.clientId;

  const handleCreateChat = async () => {
    try {
      const response = await createChat(senderId, receiverId);
      dispatch(setCurrentChat(response?.data));
      router.push("/fl/chat");

      console.log("Chat created successfully!", response);

      // setSenderId('');
      // setReceiverId('');
      console.log("Chat response:", response.data);
    } catch (error) {
      console.log("Failed to create chat. Please try again.");
      console.error("Error creating chat:", error);
    }
  };


  return (
    <div className="group">
      <div className="p-4 border  border-slate-200   bg-white max-w-72  lg:max-w-[22.5rem] rounded-lg h-full w-full  sm:group-hover:scale-105  sm:group-hover:border-primary group-hover:border-opacity-50  transition-all ease-in-out">
        <div className="flex h-full flex-col gap-2  sm:gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3  sm:gap-4">
            <div>
              <span className="text-xs font-medium flex flex-row gap-1">
                Posted by
                <p className="text-blue-500 cursor-pointer ">
                  {project?.clientName}
                </p>
              </span>
              <div className="text-black text-base sm:text-lg font-bold leading-tight">
                {project?.title}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium line-clamp-3">
                  {project?.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-col gap-4 sm:gap-4 text-sm h-full   font- ">
            <div className="flex flex-col gap-2">
              <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 ">
                <span className="flex flex-row gap-1 items-center  w-50 sm:w-55 sm:text-sm text-xs">
                  <FiCircle className="text-xs text-primary font-bold" />
                  {project?.projectCategory}
                </span>
                <span className="flex flex-row sm:text-sm text-xs items-center text-green-500">
                  <span className="text-black font-semibold">Budget:</span>
                  <span className="flex flex-row items-center">
                    <MdCurrencyRupee />
                    {project?.budget}
                  </span>
                </span>
              </div>
              <span className=" sm:text-sm text-xs w-full  flex flex-row items-center gap-1 ">
                <IoCalendarOutline className="text-primary font-bold" />
                Posted {formatDate(project?.createdAt)}
              </span>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div>{/* <Separator />{" "} */}</div>
              <div className="flex flex-row gap-2 w-full">
                <a
                  href={`/fl/jobdetails/${project?._id}`}
                  className="w-full"
                >
                  <Button className="flex flex-row mt-0 w-full items-center bg-primary active:bg-primaryho active:scale-90 hover:bg-primary shadow-none sm:group-hover:bg-black transition-all ease-in-out">
                    View Job
                  </Button>
                </a>
                {/* <Link href="" className="w-full" onClick={handleCreateChat}> */}
                <Button onClick={handleCreateChat} className="flex flex-row mt-0 text-black w-full items-center bg-transparent active:bg-transparent active:scale-90 hover:bg-transparent  border border-gray-300 shadow-none transition-all ease-in-out">
                  Chat
                </Button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardFreelancer;
