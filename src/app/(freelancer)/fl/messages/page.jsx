"use client";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setCurrentChat } from '@/app/(redux)/features/chatDataSlice';
import { useEffect, useState } from 'react';
import Conversation from '@/components/Conversation';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { userChats } from '@/services/chatRequest';
import Loader2 from '@/components/Loader2';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.chatData.userData);
  const onlineUsers = useSelector((state) => state.socket.onlineUsers);

  const userId = userData?.id;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    let isMounted = true;
    const getChats = async () => {
      if (!userData?.id) return;
      try {
        setLoading(true);
        const { data } = await userChats(userData.id);
        if (isMounted) {
          setChats(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching user chats:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (userData?.id) {
      getChats();
    }
  }, [userData]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members?.find((member) => member !== userId);
    const online = onlineUsers?.some((user) => user.userId === chatMember);
    return Boolean(online);
  };

  const handleSelectChat = (chat) => {
    dispatch(setCurrentChat(chat));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("karmsetu_current_chat", JSON.stringify(chat));
    }
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white border  border-gray-200   w-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-row gap-2 items-center text-xl text-gray-800 font-semibold mb-3">
            <IoChatbubblesOutline className="text-primary text-2xl" />
            <span>Messages & Conversations</span>
          </div>
          <div className="relative text-gray-600">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-gray-400"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full py-2 pl-10 pr-4 bg-gray-50 text-sm outline-none border border-gray-200 rounded-lg focus:bg-white focus:border-primary transition"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[34rem] divide-y divide-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 px-4">
              <IoChatbubblesOutline className="text-5xl text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                When you connect with clients, your conversations will appear here.
              </p>
            </div>
          ) : (
            <div>
              {chats.map((chat) => (
                <div
                  key={chat._id || chat.id}
                  onClick={() => handleSelectChat(chat)}
                >
                  <Conversation
                    data={chat}
                    currentUserId={userData?.id}
                    online={checkOnlineStatus(chat)}
                    chatPath="/fl/chat"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

