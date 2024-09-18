"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_ITEMS } from "@/constants/freelancer/constants";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "@/app/(redux)/features/socketSlice";
import {
  setReceiveMessage,
  setSendMessage,
  setUserData,
} from "@/app/(redux)/features/chatDataSlice"; // Make sure to import setSendMessage
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { RiLogoutCircleRLine } from "react-icons/ri";

const SideNav = () => {
  const dispatch = useDispatch();
  const sendMessage = useSelector((state) => state.chatData.sendMessage);
  const userData = useSelector((state) => state.chatData.userData);
  
  const socket = useRef();
  const [imgLink, setImgLink] = useState("");
  const [user1,setUser1]=useState();

  const userId = user1?.id;
  // const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("karmsetu");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setUser1(parsedData)
        dispatch(setUserData(parsedData));
        setImgLink(parsedData?.profileImage);
      } catch (error) {
        console.error("Invalid session storage data", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      socket.current = io("https://karmsetu-socket.onrender.com");

      socket.current.on("connect", () => {
        socket.current.emit("new-user-add", userId);
      });

      socket.current.on("get-users", (users) => {
        dispatch(setOnlineUsers(users));
        console.log("OnlineUser: ", users);
      });

      socket.current.on("recieve-message", (data) => {
        dispatch(setReceiveMessage(data));
      });

      
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (sendMessage !== null && socket.current) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  return (
    <div className="fixed flex-1 hidden h-screen bg-white border-r md:w-60 border-zinc-200 md:flex">
      <div className="flex flex-col w-full space-y-6 ">
        <Link
          href="/cl"
          className="flex flex-row items-center justify-center w-full h-12 space-x-1 border-b md:justify-start md:px-6 py-3 border-zinc-200"
        >
          <span className="flex w-32">
            <Image
              src="/images/karmsetuLogo-cropped.svg"
              width="0"
              height="0"
              className="w-auto h-auto"
              alt="Site Logo"
            />
          </span>
        </Link>

        <div className="flex flex-col space-y-2 md:px-0 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>

        <div className="flex h-full flex-col  justify-between">
          <div className="px-4"></div>
          <div>
            <div className="px-5 mb-4">
              <Separator className="h-0.5 opacity-50 rounded-full" />
            </div>
            <div className="md:px-4 mb-6 flex flex-row items-center gap-3">
              <div className="flex items-center justify-center text-center rounded-full h-9 w-9 ">
                {imgLink && (
                  <Link href={`/fl/user/${userData?.id}`}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        alt="Profile Image"
                        src={imgLink ? imgLink : "/images/user/user-01.png"}
                        className="h-9 w91 object-contain"
                      />
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                  </Link>
                )}
              </div>
              <div className="flex flex-row justify-between gap-3">
                <div className="flex flex-col leading-none">
                  <span className="text-black text-sm font-semibold flex flex-row   gap-1">
                    {userData?.name}{" "}
                    <span className="pt-1">
                      <div className="bg-green-500 h-1 w-1 rounded-full"> </div>
                    </span>
                  </span>
                  <span className="text text-xs text-opacity-75">
                    {userData?.email}
                  </span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
                      <BsThreeDotsVertical className="cursor-pointer text-black text-sm mt-1 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex flex-row gap-2 text-gray-400 font-medium hover:font-medium items-center">
                        Log Out <RiLogoutCircleRLine />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SideNav;
const MenuItem = ({ item }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex  flex-row items-center py-2 px-6 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
              pathname.includes(item.path)
                ? "bg-primary bg-opacity-15   text-primary hover:bg-violet-700"
                : ""
            }`}
          >
            <div className="flex flex-row items-center space-x-4">
              {item.icon}
              <span className="flex text-xl font-semibold">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="flex flex-col my-2 ml-12 space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname
                        ? "font-semibold text-primary"
                        : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row  space-x-4 items-center py-2 px-6 group   hover:bg-zinc-100 ${
            item.path === pathname
              ? "bg-primary bg-opacity-15   text-primary border-l-[6px] border-primary   hover:bg-violet-700"
              : ""
          }`}
        >
          {item.icon}
          <span className="flex text-xl font-semibold group-hover:scale-105 transition-transform ease-in-out">
            {item.title}
          </span>
        </Link>
      )}
    </div>
  );
};
