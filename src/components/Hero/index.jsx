"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
const Hero = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    // if (user === undefined) {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUser(data);
    console.log("newnew user", user);
    // }

  }, [])

  return (<>
    <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
          <div className=" md:w-1/2">
            <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
              ✨ Karmsetu - A Comprehensive Hub for Freelancers and Clients
            </h4>
            <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero ">
              Leap to Freelance, Opportunity to {"   "}
              <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                Connect
              </span>
            </h1>
            <p>
              Karmsetu - Streamlining freelancing with a user-friendly interface for job posting, profile management, and real-time collaboration. Includes AI recommendations, integrated payments, and a versatile dashboard, all built with Next.js and React for top performance
            </p>

            <div className="mt-10">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap gap-5">
                  {/* <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter your email address" className="rounded-full border border-stroke px-6 py-2.5 shadow-solid-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"/> */}
                  {<Link href={user?.role === "freelancer" ? "/fl" : user?.role === "client" ? "/cl" : "/auth/signin"} className="flex rounded-lg bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho">
                    Get Started
                  </Link>}
                  <button aria-label="get started button" className="flex rounded-lg bg-white text-secondary outline-1 outline-secondaryho outline-dashed px-7.5 py-2.5 hover:scale-[0.97] transition-transform ease-in-out dark:bg-btndark dark:hover:bg-blackho">Learn more</button>
                </div>
              </form>

              <p className="mt-5 text-black dark:text-white">
                Click on Get Started to explore posiblities.
              </p>
            </div>
          </div>

          <div className="animate_right hidden md:w-1/2 lg:block">
            <div className="relative 2xl:-mr-7.5">
              <Image src="/images/shape/shape-02.svg" alt="shape" width={46} height={246} className="absolute -left-11.5 top-0  fill-secondary" />
              <Image src="/images/shape/shape-03.svg" alt="shape" width={36.9} height={36.7} className="absolute bottom-0 right-0 z-10" />
              <Image src="/images/shape/shape-02.svg" alt="shape" width={21.64} height={21.66} className="absolute -right-6.5 bottom-0 z-1" />
              <div className=" relative aspect-[700/444] w-full">
                {/* <Image className="shadow-solid-l dark:hidden" src="/images/hero/hero-light.svg" alt="Hero" fill/> */}
                <Image className=" dark:hidden" src="/hero2.svg" alt="hero" fill />
                <Image className="hidden dark:block" src="/hero2.svg" alt="Hero" fill />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>);
};
export default Hero;
