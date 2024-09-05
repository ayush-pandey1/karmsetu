"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./select.css";

const Select = () => {

  const [role, setRole] = useState(""); 

  const handleRoleChange = (event) => {
    setRole(event.target.value); 
    console.log(role)
  };

    
  return (
    <>
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
          >
            <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
              Choose Your Role
            </h2>

            <form className="flex pb-11">
              <fieldset className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <label
                    for="plan-business"
                    className="relative flex flex-col border-2 border-stroke bg-white dark:bg-blacksection dark:border-strokedark  p-5 rounded-lg  cursor-pointer"
                  >
                    <div className="flex flex-col max-w-80">
                      <div className="pb-6">
                        <p className="text-itemtitle font-inter text-primary font-semibold">
                        I'm a Client
                        </p>
                      </div>

                      <div>
                        <p className="text-regular">
                        Post projects, hire talented freelancers, and get work done.
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="choice"
                      id="plan-business"
                      value="client"
                      className="absolute h-0 w-0 appearance-none"
                      onChange={handleRoleChange}
                    />
                    <span
                      aria-hidden="true"
                      className="hidden absolute inset-0 border-2 border-green-500 bg-green-200 bg-opacity-10 rounded-lg"
                    >
                      <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-green-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5 text-green-600"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                  </label>

                  <label
                    for="plan-enterprise"
                    className="relative flex flex-col border-2 border-stroke bg-white dark:bg-blacksection dark:border-strokedark p-5 rounded-lg focus:border-none cursor-pointer"
                  >
                    <div className="flex flex-col max-w-80">
                      <div className="pb-6">
                        <p className="text-itemtitle font-inter text-primary  font-semibold">
                          I'm a Freelancer
                        </p>
                      </div>

                      <div>
                        <p className="text-regular">
                        Find projects, showcase your skills, and grow your
                        career.
                        </p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="choice"
                      id="plan-enterprise"
                      value="freelancer"
                      className="absolute h-0 w-0 appearance-none"
                      onChange={handleRoleChange}
                    />
                    <span
                      aria-hidden="true"
                      className="hidden absolute inset-0 border-2 border-green-500 bg-green-200 bg-opacity-10 rounded-lg"
                    >
                      <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-green-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5 text-green-600"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>
            </form>

            <div className="flex flex-col  items-center">
              <button
                aria-label="signup with email and password"
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-primaryho "
              >
                <Link href={`/auth/signup?role=${role}`}>Continue</Link>
                <svg
                  className="fill-white"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>

            <div className="mt-12.5 border-t border-stroke py-5 text-center dark:border-strokedark">
              <p>
                Already have an account?{" "}
                <Link
                  className="text-black hover:text-primary dark:text-white dark:hover:text-primary"
                  href="/auth/signin"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Select;
