"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_ITEMS } from "@/constants";
import { Icon } from "@iconify/react";
const SideNav = () => {
  return (
    <div className="fixed flex-1 hidden h-screen bg-white border-r md:w-60 border-zinc-200 md:flex">
      <div className="flex flex-col w-full space-y-6 ">
        <Link
          href="/cl"
          className="flex flex-row items-center justify-center w-full h-12 space-x-3 border-b md:justify-start md:px-6 border-zinc-200"
        >
          <span className="rounded-lg h-7 w-7 bg-zinc-300" />
          {/* <span className="hidden text-xl font-bold md:flex">Karmsetu</span> */}
          <p className="hidden text-xl font-bold text-black md:flex dark:text-white">
            Karm<span className="text-primary">Setu</span>
          </p>
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
            className={`flex transition-all ease-in-out flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
              pathname.includes(item.path)
                ? "bg-primary drop-shadow-sm  text-white hover:bg-violet-600"
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
          className={`flex flex-row transition-all ease-in-out space-x-4 items-center p-2  rounded-lg hover:bg-zinc-100 ${
            item.path === pathname
              ? "bg-primary drop-shadow text-white hover:bg-violet-600"
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
