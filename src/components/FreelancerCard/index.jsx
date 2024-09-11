import Image from "next/image";
import React from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { RiSuitcaseLine } from "react-icons/ri";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "@/services/chatRequest";
import { setCurrentChat } from "@/app/(redux)/features/chatDataSlice";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoChatbubbleOutline } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FreelancerCard = ({
  fullname,
  professionalTitle,
  skill,
  bio,
  id,
  rating,
  imageLink,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chatData.userData);
  const receiverId = id;
  const senderId = user?.id;
  const router = useRouter();
  // console.log("senderId: ", senderId, "receiverId: ", receiverId);
  const handleCreateChat = async () => {
    try {
      const response = await createChat(senderId, receiverId);
      dispatch(setCurrentChat(response?.data));
      router.push("/cl/chat");

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
    <div className="p-6 flex flex-col gap-4  border bg-white border-gray-200  w-full rounded-lg">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-5">
          <Avatar className="h-15 w-15">
            <AvatarImage
              src={imageLink ? imageLink : "/images/user/user-02.png"}
              alt="Freelancer Photo"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col sm:gap-1">
            <span className="text-black text-xl font-medium">{fullname}</span>
            <span className="text-sm text-[#6e6d7a]">{professionalTitle}</span>
          </div>
        </div>

        <div className="sm:flex flex-row gap-2 hidden ">
          <Button
            className="w-full shadow-none text-black text-xl bg-transparent hover:bg-transparent border  border-gray-200 p-3"
            onClick={handleCreateChat}
          >
            <IoChatbubbleOutline />
          </Button>
          <Button className="w-full bg-black hover:bg-blackho shadow-none text-white ">
            <Link href={`/cl/user/${id}`}>View Profile</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex flex-row items-center font-medium  text-green-500 bg-green-400 bg-opacity-10 border border-green-400 px-2 rounded-full text-sm">
          <MdOutlineCurrencyRupee className="" /> 500/hr
        </div>
        <div className="flex flex-row items-center gap-1  text-blue-500 bg-blue-400 bg-opacity-10 border border-blue-400 px-2 rounded-full text-sm">
          <RiSuitcaseLine className="text-lg text-blue-500" /> 15
        </div>
        <div className="flex flex-row items-center gap-1">
          <FaRegStar className="text-yellow-500" /> {rating}
        </div>
      </div>

      <div className="">
        <span className="line-clamp-4 text-[#6e6d7a] font- text-sm leading-[1.5] py-1">
          {bio}
        </span>
      </div>

      {/* Portfolio Projects Small Screen Carousel */}
      {/* <div className="block w-full sm:hidden"> */}
      <div className="">
        <Carousel
          opts={{
            align: "center",
          }}
          className=" "
        >
          <CarouselContent className="h-50 w-80 pb-3 ">
            <CarouselItem className=" ">
              <Image
                src="/images/portfolio/portfolio4.png"
                alt="Project Image"
                height="0"
                width="0"
                className="h-full w-full rounded-lg"
                unoptimized
              />
            </CarouselItem>

            <CarouselItem className="">
              <Image
                src="/images/portfolio/portfolio2.jpg"
                alt="Project Image"
                height="0"
                width="0"
                className="h-full w-full rounded-lg"
                unoptimized
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                src="/images/portfolio/portfolio5.png"
                alt="Project Image"
                height="0"
                width="0"
                className="h-full w-full rounded-lg"
                unoptimized
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                src="/images/portfolio/portfolio3.jpg"
                alt="Project Image"
                height="0"
                width="0"
                className="h-full w-full rounded-lg"
                unoptimized
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Portfolio Projects big screen static */}
      {/* <div className="sm:flex sm:overflow-scroll hidden   gap-3">
        <div className="">
          <Image
            src="/images/portfolio/portfolio4.png"
            alt="Project Image"
            height="0"
            width="0"
            className="h-40 w-72  rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div className="">
          <Image
            src="/images/portfolio/portfolio5.png"
            alt="Project Image"
            height="0"
            width="0"
            className="h-40 w-72  rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div className="">
          <Image
            src="/images/portfolio/portfolio3.jpg"
            alt="Project Image"
            height="0"
            width="0"
            className="h-40 w-72  rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div className="">
          <Image
            src="/images/portfolio/portfolio2.jpg"
            alt="Project Image"
            height="0"
            width="0"
            className="h-40 w-72  rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div className="">
          <Image
            src="/images/portfolio/portfolio1.jpg"
            alt="Project Image"
            height="0"
            width="0"
            className="h-40 w-72  rounded-lg object-cover"
            unoptimized
          />
        </div>
        
      </div> */}

      <div className="flex flex-row gap-2 sm:hidden ">
        <Button className="w-full bg-primary hover:bg-primaryho shadow-none text-white px-1">
          <Link href={`/cl/user/${id}`}>View Profile</Link>
        </Button>
        <Button
          className="w-full shadow-none text-black bg-transparent hover:bg-transparent border  border-gray-200"
          onClick={handleCreateChat}
        >
          Chat
        </Button>
      </div>
    </div>
  );
};

export default FreelancerCard;
