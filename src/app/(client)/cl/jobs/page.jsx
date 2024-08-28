"use client";
import { GoPlus } from "react-icons/go";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import JobCardClient from '@/components/JobCardClient';
import { useDispatch, useSelector } from "react-redux";
import { Button } from '@/components/ui/button';
import { fetchProjects } from '../../../(redux)/features/projectDataSlice';

const JobPage = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);
  }, [])
  const user = userData?.name;
  const clientId = userData?.id;
  useEffect(() => {
    if (clientId) {
      dispatch(fetchProjects(clientId));
    }
  }, [clientId, dispatch]);

  const projects = useSelector((state) => state.projects.projects);
  const length = useSelector((state) => state.projects.allProjects);

  return (
    <>
      <div className="flex flex-col gap-20 mx-0 sm:mx-15 mt-5">
        <div className="font-bold   flex flex-col sm:flex-row gap-2 sm:gap-0  sm:justify-between sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="text-2xl text-black sm:text-4xl">
              All Posted Jobs
            </div>
            <div className="font-medium md:text-base text-sm">
              Review, Manage, and Create New Jobs/Gigs
            </div>
          </div>
          <div className="flex items-center">
            <Button className="flex item-center gap-1 text-white  bg-primary hover:bg-primaryho">
              <Link href="/cl/createjob">Post Job</Link>
              <span className="text-white text-xl">
                <GoPlus />
              </span>
            </Button>
          </div>
        </div>
        <div className="w-full  grid grid-cols-1 grid-rows-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4 place-items-center sm:place-items-stretch md:place-items-center lg:place-items-stretch">
          <JobCardClient projects={projects} length={length} />
        </div>
      </div>
    </>
  );
};
export default JobPage;
