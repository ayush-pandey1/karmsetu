"use client";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setCurrentChat } from '@/app/(redux)/features/chatDataSlice';
import { useEffect, useState } from 'react';
import Conversation from '@/components/Conversation';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { userChats } from '@/services/chatRequest';
// import { io } from 'socket.io-client';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.chatData.userData);
  const currentChat = useSelector((state) => state.chatData.currentChat);
  // const [sendMessage, setSendMessage] = useState(null);
  const onlineUsers = useSelector((state) => state.socket.onlineUsers);
  // const onlineUsers = useSelector((state) => state.socket.onlineUsers);

  const userId = userData?.id;
  const [chats, setChats] = useState([]);
  // console.log("new chats: ", chats);
  // const socket = useRef();
  // const [onlineUsers, setOnlineUsers] = useState([]);
  // useEffect(() => {
  //   if (userId) {
  //     socket.current = io("http://localhost:8800");
  //     socket.current.emit("new-user-add", userId);
  //     socket.current.on("get-users", (users) => {
  //       setOnlineUsers(users);
  //       console.log("OnlineUser: ", onlineUsers);
  //     })
  //   }
  // }, [userData])
  // console.log("user: ", userId);


  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(userData?.id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (userData) {
      getChats();
    }
  }, [userData]);

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

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== userId);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  }

  return (
    <>
      <div className="flex flex-col gap-12 mx-3 sm:mx-8 mt-5">
        <div className="border-r border-l border-t rounded-md border-gray-300 lg:col-span-1">
          <div className="mx-3 my-3">
            <div className="relative text-gray-600">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-300"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="search"
                className="block w-full py-2 pl-10 bg-gray-100 outline-none border border-gray-300 rounded-lg"
                name="search"
                placeholder="Search"
                required
              />
            </div>
          </div>

          <ul className="overflow-auto h-[32rem]">
            <div className="my-2 mb-2 ml-2 flex flex-row gap-1 items-center text-xl text-black font-medium">
              <IoChatbubblesOutline className="text-green-500" />
              Chats
            </div>

            <li>
              {chats && chats.map((chat) => (
                <div key={chat.id} onClick={() => dispatch(setCurrentChat(chat))}>
                  <Conversation data={chat} currentUserId={userData?.id} online={checkOnlineStatus(chat)} />
                </div>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
