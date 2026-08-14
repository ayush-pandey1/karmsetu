import { getUser } from '@/services/chatRequest';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Conversation = ({ data, currentUserId, online, chatPath = "/cl/chat" }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data?.members?.find((id) => id !== currentUserId);
    if (!userId) return;

    let isMounted = true;
    const getUserData = async () => {
      try {
        const { data: resData } = await getUser(userId);
        if (isMounted && resData?.user) {
          setUserData(resData.user);
        }
      } catch (error) {
        console.error("Error fetching conversation user:", error);
      }
    };
    getUserData();

    return () => {
      isMounted = false;
    };
  }, [data, currentUserId]);

  const initials = userData?.fullname
    ? userData.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const avatarUrl = userData?.imageLink || userData?.profileImage || "/images/user/user-07.png";

  return (
    <Link
      href={chatPath}
      className="flex items-center px-3 py-3 text-sm transition duration-150 ease-in-out border-b border-gray-200 cursor-pointer hover:bg-gray-50 focus:outline-none"
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={avatarUrl}
            alt={userData?.fullname || "User"}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </div>
      <div className="w-full pl-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800 truncate max-w-[180px]">
            {userData?.fullname || "Loading..."}
          </span>
          <span className="text-xs text-gray-400">
            {online ? (
              <span className="text-green-600 font-medium">Online</span>
            ) : (
              "Offline"
            )}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {userData?.professionalTitle || "Click to open conversation"}
        </p>
      </div>
    </Link>
  );
};

export default Conversation;