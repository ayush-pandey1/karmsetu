"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlineUploadFile } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { addMessage, getMessages, getUser } from "@/services/chatRequest";
import { formatDistanceToNow } from 'date-fns';
import InputEmoji from "react-input-emoji";
import Loader2 from "@/components/Loader2";
import { setSendMessage, setReceiveMessage } from "@/app/(redux)/features/chatDataSlice";
// import {format} from 'timeago.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const scroll = useRef();

  const router = useRouter();
  const user = useSelector((state) => state.chatData.userData);
  const chat = useSelector((state) => state.chatData.currentChat);
  const receiveMessage = useSelector((state) => state.chatData.receiveMessage);
  const onlineUsers = useSelector((state) => state.socket.onlineUsers);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // console.log("online: ", onlineUsers, "user:  ", user);
  // console.log("Chat: ", chat);

  const currentUserId = user?.id;
  // console.log("dddd", currentUserId, chat);
  useEffect(() => {
    if (!chat) {
      router.push("/cl/messages");
    }
  }, [chat])
  // if (!chat) {
  //   router.push("/cl/messages");
  // }
  // useEffect(() => {
  //   if (!chat) {

  //   }
  // }, [chat]);

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage?.chatId === chat?._id)
      setMessages([...messages, receiveMessage]);
  }, [receiveMessage])

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    const getuserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data?.user);
        console.log("daTTa: ", data?.user);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getuserData();
  }, [chat, currentUserId]);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat?._id);
        setMessages(data);
        console.log("Message: ", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    // console.log(newMessage)
    setNewMessage(newMessage);
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat?._id,
    }
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    const receiverId = chat.members.find((id) => id !== currentUserId);
    dispatch(setSendMessage({ ...message, receiverId }));
  }
  const [temp, setTemp] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTemp(false);
    }, 2000);
    return () => clearTimeout(timer);
  })
  useEffect(() => {

    // if (temp) {
    //   scroll.current?.scrollIntoView({ behaviour: "auto" })
    // }
    // else {
    scroll.current?.scrollIntoView({ behaviour: "smooth" })
    // }

  }, [messages])

  // console.log("user::: ", user);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members.find((member) => member !== user.id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  }


  return (
    <>{chat ? (<div className="flex flex-col flex-grow w-full max-w-full bg-white shadow-xl overflow-hidden no-scrollbar">
      {/* Top Bar */}
      <div className="bg-white border border-b-gray-300 shadow-sm py-2 px-4 flex flex-row justify-between items-center ">
        <div className="flex flex-row gap-3 items-center">
          <Image
            src="/images/user/user-01.png"
            alt="User Image"
            height="32"
            width="32"
            className="rounded-md"
          />
          <div className="flex flex-col leading-6">
            <span className="text-black font-semibold text-md">
              {userData?.fullname}
            </span>
            {checkOnlineStatus(chat) ? <span className="text-xs ">Online</span> : <span className="text-xs ">Offline</span>}

          </div>
        </div>
        <div className="text-2xl">
          <div>
            <IoVideocamOutline />
          </div>
        </div>
      </div>
      {/* Top Bar */}
      <div className="flex flex-col flex-grow h-0 p-4 overflow-auto no-scrollbar">
        {/* Other User */}
        {messages &&
          messages.map((message) => {
            return message.senderId === currentUserId ? (
              <div
                key={message._id} ref={scroll}
                className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
              >
                <div>
                  <div className="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 leading-none">
                    {/* {formatDistanceToNow(message.createdAt)} */}
                  </span>
                </div>
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                  <Image
                    src="/images/user/user-05.png"
                    width="100"
                    height="100"
                    alt="User pfp"
                    className="h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <div
                key={message._id}
                ref={scroll}
                className="flex w-full mt-2 space-x-3 max-w-xs"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                  <Image
                    src="/images/user/user-03.png"
                    width="100"
                    height="100"
                    alt="User pfp"
                    className="h-full w-full"
                  />
                </div>
                <div>
                  <div className=" border bg-gray-200 p-3 rounded-r-2xl rounded-bl-2xl">
                    <p className="text-sm font-medium text-black">
                      {message.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 leading-none">
                    {/* {formatDistanceToNow(message.createdAt)} */}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Input Bar */}
      <div className="bg-transparent  px-2 mb-2 flex flex-row gap-2 items-center ">
        <div className="flex flex-row w-full rounded-lg bg-slate-100 px-3 border-gray-300">
          <button className=" text-gray-500 text-xl pl-2 rounded-lg flex items-center justify-center">
            <MdOutlineUploadFile />
          </button>
          <InputEmoji
            value={newMessage}
            onChange={handleChange}
          />
          {/* <Input
          className="flex items-center h-10 w-full placeholder:text-black placeholder:font-medium placeholder:font-inter  text-sm border bg-slate-100 border-none  focus:outline-none text-black"
          type="text"
          placeholder="Type your message................"
        /> */}

        </div>

        <button onClick={handleSend} className="bg-primary text-white text-xl p-2.5 rounded-lg flex items-center justify-center">
          <FiSend />
        </button>
      </div>
    </div>) : (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 />
      </div>
    )}

    </>
  );
};

export default ChatPage;
