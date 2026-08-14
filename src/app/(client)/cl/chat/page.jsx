"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import { IoVideocamOutline } from "react-icons/io5";
import InputEmoji from "react-input-emoji";
import TimeAgo from "react-timeago";
import toast from "react-hot-toast";

import { addMessage, getMessages, getUser } from "@/services/chatRequest";
import {
  setSendMessage,
  setCurrentChat,
  setUserData,
} from "@/app/(redux)/features/chatDataSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader2 from "@/components/Loader2";

const ClientChatPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.chatData.userData);
  const chat = useSelector((state) => state.chatData.currentChat);
  const receiveMessage = useSelector((state) => state.chatData.receiveMessage);
  const onlineUsers = useSelector((state) => state.socket.onlineUsers);

  const [userData, setUserDataState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const currentUserId = user?.id;

  // Hydrate user data from session storage if missing in Redux
  useEffect(() => {
    if (!user) {
      const data = sessionStorage.getItem("karmsetu");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          dispatch(setUserData(parsed));
        } catch (err) {
          console.error("Failed to parse user session", err);
        }
      }
    }
  }, [user, dispatch]);

  // Hydrate current chat from session storage if missing in Redux on refresh
  useEffect(() => {
    if (!chat) {
      const savedChat = sessionStorage.getItem("karmsetu_current_chat");
      if (savedChat) {
        try {
          const parsedChat = JSON.parse(savedChat);
          dispatch(setCurrentChat(parsedChat));
        } catch (err) {
          console.error("Failed to parse saved chat session", err);
          router.push("/cl/messages");
        }
      } else {
        router.push("/cl/messages");
      }
    }
  }, [chat, dispatch, router]);

  // Append new incoming socket message with deduplication
  useEffect(() => {
    if (receiveMessage && chat?._id && receiveMessage.chatId === chat._id) {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            (receiveMessage._id && m._id === receiveMessage._id) ||
            (m.createdAt === receiveMessage.createdAt &&
              m.text === receiveMessage.text &&
              m.senderId === receiveMessage.senderId),
        );
        if (isDuplicate) return prev;
        return [...prev, receiveMessage];
      });
    }
  }, [receiveMessage, chat?._id]);

  // Fetch receiver user details
  useEffect(() => {
    if (!chat || !currentUserId) return;
    const recipientId = chat?.members?.find((id) => id !== currentUserId);
    if (!recipientId) return;

    let isMounted = true;
    const fetchUserData = async () => {
      try {
        const { data } = await getUser(recipientId);
        if (isMounted && data?.user) {
          setUserDataState(data.user);
        }
      } catch (error) {
        console.error("Error fetching chat user details:", error);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [chat, currentUserId]);

  // Fetch conversation messages
  useEffect(() => {
    if (!chat?._id) return;
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await getMessages(chat._id);
        if (isMounted) {
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();
    return () => {
      isMounted = false;
    };
  }, [chat?._id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed || isSending || !chat?._id || !currentUserId) return;

    setIsSending(true);
    const messagePayload = {
      senderId: currentUserId,
      text: trimmed,
      chatId: chat._id,
    };

    try {
      const { data: savedMessage } = await addMessage(messagePayload);
      if (savedMessage) {
        setMessages((prev) => [...prev, savedMessage]);
        setNewMessage("");

        const receiverId = chat?.members?.find((id) => id !== currentUserId);
        if (receiverId) {
          dispatch(setSendMessage({ ...savedMessage, receiverId }));
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const isUserOnline = () => {
    if (!chat || !currentUserId) return false;
    const recipientId = chat?.members?.find((id) => id !== currentUserId);
    return onlineUsers?.some((u) => u.userId === recipientId);
  };

  const recipientInitials = userData?.fullname
    ? userData.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const recipientAvatar =
    userData?.imageLink || userData?.profileImage || "/images/user/user-01.png";

  if (!chat && loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full mx-auto bg-white shadow-sm border border-gray-200 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row gap-3 items-center">
          <Link
            href="/cl/messages"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            title="Back to conversations"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={recipientAvatar}
                alt={userData?.fullname || "Freelancer"}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {recipientInitials}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isUserOnline() ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-semibold text-sm sm:text-base leading-tight">
              {userData?.fullname || "Conversation"}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              {isUserOnline() ? (
                <span className="text-green-600 font-medium">Online</span>
              ) : (
                "Offline"
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition text-xl">
            <IoVideocamOutline />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-2xl text-gray-400">
              💬
            </div>
            <p className="font-semibold text-gray-600">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Send a message below to start your conversation.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMe = message.senderId === currentUserId;
            return (
              <div
                key={message._id || `msg-${index}-${message.createdAt}`}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-sm md:max-w-md ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-primary text-white rounded-br-none shadow-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 px-1 mt-1">
                    {message.createdAt ? (
                      <TimeAgo date={message.createdAt} />
                    ) : (
                      "Just now"
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="bg-white border-t border-gray-200 p-3 flex flex-row gap-2 items-center">
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-primary focus-within:bg-white transition">
          <InputEmoji
            value={newMessage}
            onChange={setNewMessage}
            cleanOnEnter
            onEnter={handleSend}
            placeholder="Type your message..."
            borderRadius={8}
            borderColor="transparent"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || isSending}
          className="bg-primary text-white p-3 rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          title="Send message"
        >
          {isSending ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ClientChatPage;
