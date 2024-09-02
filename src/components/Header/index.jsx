// components/Header/index.jsx

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { Button } from "../ui/button";
import { signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [role, setRole] = useState("")
  const [userData, setUserData] = useState();
  const pathUrl = usePathname();
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);
    if (!userData) {
      if (session?.user?.email) {

        async function fetchUserData(email) {
          try {
            const response = await fetch('/api/userInfoByEmail', {
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ data: { email } })
            });

            const result = await response.json();

            if (response.ok) {
              console.log("User Data:", result.user);
              setUser(result.user);

              const sessionData = {
                email: user.email,
                name: user.fullname,
                id: user._id,
                role: user.role,
              };
              setRole(sessionData?.role);
              console.log("sdsd", role);
              sessionStorage.setItem('karmsetu', JSON.stringify(sessionData));
              console.log('Session data stored in sessionStorage:', sessionData);
              const data = JSON.parse(sessionStorage.getItem('karmsetu'));
              setRole(data?.role);
              setUserData(data);
            } else {
              console.error("Error:", result.message);
            }
          } catch (error) {
            console.error("Fetch Error:", error);
          }
        }

        fetchUserData(session.user.email);



      }
      else {
        const data = JSON.parse(sessionStorage.getItem('karmsetu'));
        setUserData(data);
        console.log("asas", data);
        // setUserEmail(data?.email);
        setRole(data?.role);
      }
    }
  }, [session, role]);

  const logout = () => {

    sessionStorage.removeItem('karmsetu');
    signOut({ callbackUrl: '/' });
  }


  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <header className={`fixed left-0 top-0 z-99999 w-full py-7 ${stickyMenu ? "bg-white !py-4 shadow transition duration-100 dark:bg-black" : ""}`}>
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <a href="/" className="flex items-center">
            {/* <span className="font-bold text-3xl text-black dark:text-white">Karm<span className="text-primary">Setu</span></span> */}
            <span className="flex w-37.5"><Image src="/images/karmsetuLogo-cropped.svg" width="0" height="0" className="w-auto h-auto"/></span>

          </a>

          <button aria-label="hamburger Toggler" className="block xl:hidden" onClick={() => setNavigationOpen(!navigationOpen)}>
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!navigationOpen ? "!w-full delay-300" : "w-0"}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!navigationOpen ? "delay-400 !w-full" : "w-0"}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!navigationOpen ? "!w-full delay-500" : "w-0"}`}></span>
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!navigationOpen ? "!h-0 delay-[0]" : "h-full"}`}></span>
                <span className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!navigationOpen ? "!h-0 delay-200" : "h-0.5"}`}></span>
              </span>
            </span>
          </button>
        </div>

        <div className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${navigationOpen && "navbar !visible mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"}`}>
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {menuData.map((menuItem, key) => (
                <li key={key} className={menuItem.submenu && "group relative"}>
                  {menuItem.submenu ? (
                    <>
                      <button onClick={() => setDropdownToggler(!dropdownToggler)} className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary">
                        {menuItem.title}
                        <span>
                          <svg className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </span>
                      </button>

                      <ul className={`dropdown ${dropdownToggler ? "flex" : ""}`}>
                        {menuItem.submenu.map((item, key) => (
                          <li key={key} className="hover:text-primary">
                            <Link href={item.path || "#"}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={`${menuItem.path}`} className={pathUrl === menuItem.path ? "text-primary hover:text-primary" : "hover:text-primary"}>
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>




          <div className="mt-7 flex items-center gap-6 xl:mt-0">
            <ThemeToggler />

            {userData?.email ? (
              // {session?.email}
              <button
                onClick={logout}
                className="flex items-center justify-center rounded-lg bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/auth/signin" className="text-regular font-medium text-waterloo hover:text-primary">
                  Log in
                </Link>
                <Link href="/auth/select" className="flex items-center justify-center rounded-lg bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho">
                  Sign up
                </Link>
              </>

            )}
            {/* {session ? console.log("session", session) : ""} */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
