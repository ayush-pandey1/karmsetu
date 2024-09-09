"use client";

import JobCardClient from '@/components/JobCardClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { GoPlus } from 'react-icons/go';
import { useSelector, useDispatch } from "react-redux";
import { fetchClientProjects, modifyRefresh } from '../../../../(redux)/features/projectDataSlice';
import Loader2 from "@/components/Loader2";

const OngoingJobPage = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);
  }, [])
  const clientId = userData?.id;
  const projects = useSelector((state) => state.projects.ongoing);
  useEffect(() => {
    if (clientId) {
      setLoading(false);
      dispatch(fetchClientProjects(clientId));
    }
  }, [clientId, dispatch]);

  const handleRefresh = ()=>{
    console.log("refresh button clicked");
    console.log(clientId, "Client Id");
    if (clientId) {
      dispatch(modifyRefresh());
      dispatch(fetchClientProjects(clientId));
      console.log("API called again")
    }
  }

  const empty = useSelector((state) => state.projects.empty);
  return (<>
    <div className="flex flex-col gap-20 mx-0 sm:mx-15 mt-5">
      <div className="font-bold   flex flex-col sm:flex-row gap-2 sm:gap-0  sm:justify-between sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="text-2xl text-black sm:text-4xl">
            All Ongoing Jobs
          </div>
          <div className="font-medium md:text-base text-sm">
            Review, Manage, and Create New Jobs/Gigs
          </div>
          <button onClick={handleRefresh}>Reload</button>
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
      {loading ? (
            <Loader2/>
          ): (
            <JobCardClient projects={projects} empty={empty} />
          )};
      </div>

    </div>
  </>);
};
export default OngoingJobPage;
