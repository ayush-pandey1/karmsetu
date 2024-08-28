import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlineUploadFile } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";

const ChatPage = () => {
  return (
    <>
      <div class="flex flex-col flex-grow w-full max-w-full bg-white shadow-xl  overflow-hidden  no-scrollbar">
        {/* Top Bar */}
        <div class="bg-white border border-b-gray-300 shadow-sm py-2 px-4 flex flex-row justify-between items-center ">
            <div className="flex flex-row gap-3 items-center">
                <Image src="/images/user/user-01.png" alt="User Image" height="32" width="32" className="rounded-md"/>
                <div className="flex flex-col leading-6">
                    <span className="text-black font-semibold text-md">John Doe</span>
                    <span className="text-xs ">Active 2 mins ago</span>
                    
                </div>
            </div>
            <div className="text-2xl">
                <div>
                <IoVideocamOutline />
                </div>
            </div>
        </div>
         {/* Top Bar */}
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto no-scrollbar">
          <div class="flex w-full mt-2 space-x-3 max-w-xs">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            <div>
              <div class="bg-gray-300 p-3 rounded-r-2xl rounded-bl-2xl">
                <p class="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div class="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                <p class="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod.
                </p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div class="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                <p class="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            <div>
              <div class=" border bg-gray-200 p-3 rounded-r-2xl rounded-bl-2xl">
                <p class="text-sm text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div class="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                <p class="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqu cansahfdanfknaskbna.{" "}
                </p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div class="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                <p class="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div class="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                <p class="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            <div>
              <div class="bg-gray-300 p-3 rounded-r-2xl rounded-bl-2xl">
                <p class="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
          </div>
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div class="bg-primary text-white p-3 rounded-l-2xl rounded-br-2xl">
                <p class="text-sm">Lorem ipsum dolor sit.</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
        </div>
            {/* Input Bar */}
        <div class="bg-transparent  px-2 mb-2 flex flex-row gap-2 items-center">
          <div className="flex flex-row w-full rounded-lg bg-slate-100 px-3 border-gray-300">
            <Input
              class="flex items-center h-10 w-full placeholder:text-black placeholder:font-medium  text-sm border bg-slate-100 border-none  focus:outline-none text-black"
              type="text"
              placeholder="Type your message................"
            />{" "}
            <button className=" text-gray-500 text-xl pl-2 rounded-lg flex items-center justify-center">
              {" "}
              <MdOutlineUploadFile />
            </button>
          </div>

          <button className="bg-primary text-white text-xl p-2.5 rounded-lg flex items-center justify-center">
            <FiSend />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
