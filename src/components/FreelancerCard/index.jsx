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
import { useRouter } from 'next/navigation';
const FreelancerCard = ({ fullname, professionalTitle, skill, bio, id, rating, imageLink }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chatData.userData);
  const receiverId = id;
  const senderId = user?.id;
  const router = useRouter();
  // console.log("senderId: ", senderId, "receiverId: ", receiverId);
  const handleCreateChat = async () => {
    try {
      const response = await createChat(senderId, receiverId);
      dispatch(setCurrentChat(response?.data))
      router.push("/cl/chat");

      console.log('Chat created successfully!', response);

      // setSenderId('');
      // setReceiverId('');
      console.log('Chat response:', response.data);
    } catch (error) {
      console.log('Failed to create chat. Please try again.');
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4  border bg-white border-gray-200  w-72 rounded-xl">
      <div className="flex flex-row items-center gap-3">
        <Image src={imageLink ? imageLink : "/images/user/user-02.png"} height="45" width="45" alt="Freelancer Photo" className="border border-green-500 rounded-full" />
        <div className="flex flex-col">
          <span className="text-black text-lg font-semibold">{fullname}</span>
          <span className="text-xs">{professionalTitle}</span>
        </div>
      </div>
      <div>
        <span className="line-clamp-4 text-black font-medium text-md">
          {bio}
        </span>
      </div>
      <div className="flex flex-row  justify-between">
        <div className="flex flex-row items-center font-medium  text-green-500"><MdOutlineCurrencyRupee className="" /> 500/hr</div>
        <div className="flex flex-row items-center gap-1"><FaRegStar className="text-yellow-500" /> {rating}</div>
        <div className="flex flex-row items-center gap-1"><RiSuitcaseLine className="text-xl text-blue-500" /> 15</div>
      </div>
      <div className="flex flex-row gap-2">
        <Button className="w-full bg-primary hover:bg-primaryho shadow-none text-white px-1" ><Link href={`/cl/user/${id}`}>View Profile</Link></Button>
        <Button className="w-full shadow-none text-black bg-transparent hover:bg-transparent border  border-gray-200" onClick={handleCreateChat}>Chat</Button>
      </div>
    </div >
  );
};

export default FreelancerCard;
