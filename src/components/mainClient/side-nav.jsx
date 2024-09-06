"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_ITEMS } from "@/constants/client/constants";
//import { SIDENAV_ITEMS } from '../../constants/client/constants';
import { Icon } from "@iconify/react";
import Image from "next/image";
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "@/app/(redux)/features/socketSlice";
import { setReceiveMessage, setSendMessage, setUserData } from "@/app/(redux)/features/chatDataSlice"; // Make sure to import setSendMessage

const SideNav = () => {
  const dispatch = useDispatch();
  const sendMessage = useSelector((state) => state.chatData.sendMessage);
  const userData = useSelector((state) => state.chatData.userData);
  const userId = userData?.id;
  const socket = useRef();
  // const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem('karmsetu');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        dispatch(setUserData(parsedData));
      } catch (error) {
        console.error('Invalid session storage data', error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      socket.current = io("http://localhost:8800");

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

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (sendMessage !== null && socket.current) {
      socket.current.emit('send-message', sendMessage);
    }
  }, [sendMessage]);


  return (
    <div className="fixed flex-1 hidden h-screen bg-white border-r md:w-60 border-zinc-200 md:flex">
      <div className="flex flex-col w-full space-y-6 ">
        <Link
          href="/cl"
          className="flex flex-row items-center justify-center w-full h-12 space-x-1 border-b md:justify-start md:px-6 border-zinc-200"
        >
          <span className="rounded-lg"> <Image src="/karmsetu.png" alt="Gov Punjab Logo" className="" width="34" height="34"/> </span>
    
          {/* <p className="hidden text-2xl font-bold text-black md:flex dark:text-white">
            Karm<span className="text-primary">Setu</span>
          </p> */}
          <span className="flex w-32"><Image src="/images/karmsetuLogo-cropped.svg" width="0" height="0" alt="karmsetu Logo" className="w-auto h-auto"/></span>

        </Link>

        <div className="flex flex-col space-y-2 md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
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
            className={`flex transition-all ease-in-out flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${pathname.includes(item.path)
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
                    className={`${subItem.path === pathname
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
          className={`flex flex-row transition-all ease-in-out space-x-4 items-center p-2  rounded-lg hover:bg-zinc-100 ${item.path === pathname
            ? "bg-primary bg-opacity-15   text-primary hover:bg-violet-700"
            : ""
            }`}
        >
          {item.icon}
          <span className="flex text-xl font-semibold">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
