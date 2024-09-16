"use client";
import JobCardClient from '@/components/JobCardClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { GoPlus } from 'react-icons/go';
import { useSelector, useDispatch } from "react-redux";
import { fetchFreelancerProjects , modifyRefresh} from '../../../../(redux)/features/freelancerProjects';


const OngoingProjectsPage = () => {
  const [userData, setUserData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);
  }, [])
  
  const freelancerId = userData?.id;
  const projects = useSelector((state) => state.freelancer.freelancerOngoingProjects);

  const handleRefresh = ()=>{
    if (freelancerId) {
      console.log(freelancerId, "FreelancerId");
      dispatch(modifyRefresh());
      dispatch(fetchFreelancerProjects(freelancerId));
      console.log("API called again");
    }
  }

  useEffect(() => {
    if (freelancerId) {
      dispatch(fetchFreelancerProjects(freelancerId));
    }
  }, [freelancerId, dispatch]);

  const empty = useSelector((state) => state.projects.empty);
  
  return (
    <>
      <div className="flex flex-col gap-20 mx-0 sm:mx-15 mt-5">
      <div className="font-bold flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center bg-white bg-opacity-75 p-3 border border-gray-300 rounded-none sm:rounded-lg">
          <div className="flex flex-col gap-1">
            <div className="text-2xl text-black sm:text-4xl">
              All Ongoing Projects
            </div>
            <div className="font-medium md:text-base text-xs text-gray-400 text-opacity-80">
              Review, Manage, and Create New Jobs/Gigs
            </div>
            {/* <button onClick={handleRefresh}>Reload</button> */}
          </div>
          <div className="flex items-center">
          
          </div>
        </div>

        <div className="w-full  grid grid-cols-1 grid-rows-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4 place-items-center sm:place-items-stretch md:place-items-center lg:place-items-stretch">
          <JobCardClient projects={projects} empty={empty} role={1} />
        </div>

      </div>
    </>);
};
export default OngoingProjectsPage;
