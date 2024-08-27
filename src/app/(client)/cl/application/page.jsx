"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaClipboardList } from "react-icons/fa";

const ApplicationsPage = () => {
  return (
    <>
      <div className="flex flex-col gap-20 ">
        <div className="flex min-h-screen">
          <main className="flex-1 sm:px-6 bg-gray-50 rounded-xl">
            <section className="mt-8">
              <span className="flex flex-row items-center gap-1 text-2xl  mb-4">
                <FaClipboardList className="text-green-500 text-xl" />
                <p className="font-bold text-black">Freelancer Applications</p>
              </span>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm flex lg:flex-row flex-col gap-3 justify-between">
                  <div className="flex flex-col gap-2  ">
                    <div className="flex flex-row gap-2">
                      <Avatar>
                        <Link href="/fl/user/234142">
                          <AvatarImage
                            src="/images/user/user-02.png"
                            alt="Freelancer"
                          />
                        </Link>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg sm:text-xl text-black font-semibold">
                          <Link href="/fl/user/234142">John Doe</Link>
                        </h3>
                        <p className="text-gray-500 text-sm">Web Development</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className=" text-sm">
                        Project:{" "}
                        <span className="text-blue-500">
                          <Link href="/cl/jobdetails/234142">
                            {"An Ecommerce web application for shoe store"}
                          </Link>
                        </span>
                      </span>
                      <p className="text-xs sm:text-sm text-black">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptate porro aliquam et modi magni facilis alias,
                        consequuntur accusamus voluptatem necessitatibus.
                        Accusantium, culpa alias dolorum tenetur magni libero
                        explicabo! Et, quidem.
                      </p>
                      <div className="flex flex-row gap-4 text-sm sm:text-md">
                        <div className="flex flex-row gap items-center ">
                          <MdOutlineCurrencyRupee className="w-5 h-5 text-green-500" />
                          {"500"}/h
                        </div>
                        <div className="flex flex-row gap-1 items-center  ">
                          <StarIcon className="w-5 h-5 text-yellow-500" />
                          4.5
                        </div>
                      </div>
                      <div className="flex flex-row gap-1 items-center  text-gray-500 text-sm sm:text-md">
                        <IoCalendarOutline className="text-primary text-lg" />
                        <p>Applied on: 2023-05-15</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="accept"
                      className="flex items-center space-x-2 px-3  sm:px-4"
                    >
                      <CheckIcon className="w-5  h-5 " />
                      <span>Accept</span>
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2 px-3 sm:px-4"
                    >
                      <RxCross2 className="w-5  h-5 " />
                      <span>Reject</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 px-3 sm:px-4"
                    >
                      <IoChatbubblesOutline className="w-5  h-5 " />
                      <span>Chat</span>
                    </Button>
                  </div>
                </div>

                
                <div className="bg-white p-4 rounded-xl shadow-sm flex lg:flex-row flex-col gap-3 justify-between">
                  <div className="flex flex-col gap-2  ">
                    <div className="flex flex-row gap-2">
                      <Avatar>
                        <Link href="/fl/user/234142">
                          <AvatarImage
                            src="/images/user/user-02.png"
                            alt="Freelancer"
                          />
                        </Link>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg sm:text-xl text-black font-semibold">
                          <Link href="/fl/user/234142">John Doe</Link>
                        </h3>
                        <p className="text-gray-500 text-sm">Web Development</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className=" text-sm">
                        Project:{" "}
                        <span className="text-blue-500">
                          <Link href="/cl/jobdetails/234142">
                            {"An Ecommerce web application for shoe store"}
                          </Link>
                        </span>
                      </span>
                      <p className="text-xs sm:text-sm text-black">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptate porro aliquam et modi magni facilis alias,
                        consequuntur accusamus voluptatem necessitatibus.
                        Accusantium, culpa alias dolorum tenetur magni libero
                        explicabo! Et, quidem.
                      </p>
                      <div className="flex flex-row gap-4 text-sm sm:text-md">
                        <div className="flex flex-row gap items-center ">
                          <MdOutlineCurrencyRupee className="w-5 h-5 text-green-500" />
                          {"500"}/h
                        </div>
                        <div className="flex flex-row gap-1 items-center  ">
                          <StarIcon className="w-5 h-5 text-yellow-500" />
                          4.5
                        </div>
                      </div>
                      <div className="flex flex-row gap-1 items-center  text-gray-500 text-sm sm:text-md">
                        <IoCalendarOutline className="text-primary text-lg" />
                        <p>Applied on: 2023-05-15</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="accept"
                      className="flex items-center space-x-2 px-3  sm:px-4"
                    >
                      <CheckIcon className="w-5  h-5 " />
                      <span>Accept</span>
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2 px-3 sm:px-4"
                    >
                      <RxCross2 className="w-5  h-5 " />
                      <span>Reject</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 px-3 sm:px-4"
                    >
                      <IoChatbubblesOutline className="w-5  h-5 " />
                      <span>Chat</span>
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm flex lg:flex-row flex-col gap-3 justify-between">
                  <div className="flex flex-col gap-2  ">
                    <div className="flex flex-row gap-2">
                      <Avatar>
                        <Link href="/fl/user/234142">
                          <AvatarImage
                            src="/images/user/user-02.png"
                            alt="Freelancer"
                          />
                        </Link>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg sm:text-xl text-black font-semibold">
                          <Link href="/fl/user/234142">John Doe</Link>
                        </h3>
                        <p className="text-gray-500 text-sm">Web Development</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className=" text-sm">
                        Project:{" "}
                        <span className="text-blue-500">
                          <Link href="/cl/jobdetails/234142">
                            {"An Ecommerce web application for shoe store"}
                          </Link>
                        </span>
                      </span>
                      <p className="text-xs sm:text-sm text-black">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptate porro aliquam et modi magni facilis alias,
                        consequuntur accusamus voluptatem necessitatibus.
                        Accusantium, culpa alias dolorum tenetur magni libero
                        explicabo! Et, quidem.
                      </p>
                      <div className="flex flex-row gap-4 text-sm sm:text-md">
                        <div className="flex flex-row gap items-center ">
                          <MdOutlineCurrencyRupee className="w-5 h-5 text-green-500" />
                          {"500"}/h
                        </div>
                        <div className="flex flex-row gap-1 items-center  ">
                          <StarIcon className="w-5 h-5 text-yellow-500" />
                          4.5
                        </div>
                      </div>
                      <div className="flex flex-row gap-1 items-center  text-gray-500 text-sm sm:text-md">
                        <IoCalendarOutline className="text-primary text-lg" />
                        <p>Applied on: 2023-05-15</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="accept"
                      className="flex items-center space-x-2 px-3  sm:px-4"
                    >
                      <CheckIcon className="w-5  h-5 " />
                      <span>Accept</span>
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2 px-3 sm:px-4"
                    >
                      <RxCross2 className="w-5  h-5 " />
                      <span>Reject</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 px-3 sm:px-4"
                    >
                      <IoChatbubblesOutline className="w-5  h-5 " />
                      <span>Chat</span>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};
export default ApplicationsPage;
