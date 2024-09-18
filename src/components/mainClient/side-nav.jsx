"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_ITEMS } from "@/constants/client/constants";
//import { SIDENAV_ITEMS } from '../../constants/client/constants';
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
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BsThreeDotsVertical } from "react-icons/bs";

const SideNav = () => {
  const dispatch = useDispatch();
  const sendMessage = useSelector((state) => state.chatData.sendMessage);
  const userData = useSelector((state) => state.chatData.userData);
  const userId = userData?.id;
  const socket = useRef();
  const [imgLink, setImgLink] = useState(null);
  const [user1,setUser1]=useState();
  // const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("karmsetu");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setUser1(parsedData);
        dispatch(setUserData(parsedData));
      } catch (error) {
        console.error("Invalid session storage data", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (user1?.id) {
      socket.current = io("https://karmsetu-socket.onrender.com");

      socket.current.on("connect", () => {
        socket.current.emit("new-user-add", user1.id);
      });

      socket.current.on("get-users", (users) => {
        dispatch(setOnlineUsers(users));
        console.log("OnlineUser: ", users);
      });

      socket.current.on("recieve-message", (data) => {
        dispatch(setReceiveMessage(data));
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
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
        <span>
          <Link
            href="/cl"
            className="flex flex-row items-center justify-center w-full h-12 space-x-1 border-b md:justify-start md:px-6 border-zinc-200"
          >
            <span className="flex w-32">
              <Image
                src="/images/karmsetuLogo-cropped.svg"
                width="0"
                height="0"
                alt="karmsetu Logo"
                className="w-auto h-auto "
              />
            </span>
          </Link>
        </span>

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
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    alt="Profile Image"
                    src={imgLink ? imgLink : "/images/user/user-01.png"}
                    className="h-9 w91 object-contain"
                  />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col leading-none">
                  <span className="text-black text-sm font-semibold flex flex-row justify-between items-center">
                    {"John Doe"}
                  </span>
                  <span className="text text-xs text-opacity-75">
                    {"johndoework@gmail.com"}
                  </span>
                </div>
                <BsThreeDotsVertical className="cursor-pointer text-black text-sm mt-1" />
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
            className={`flex transition-all ease-in-out flex-row items-center py-2 px-6 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
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
          className={`flex flex-row transition-all ease-in-out space-x-4 group items-center py-2 px-6   hover:bg-zinc-100 ${
            item.path === pathname
              ? "bg-primary bg-opacity-15 border-l-[6px] border-primary   text-primary hover:bg-violet-700"
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
