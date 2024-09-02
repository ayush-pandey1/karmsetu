"use client";

import FreelancerCard from "@/components/FreelancerCard";
import JobCardClient from "@/components/JobCardClient";
import JobCardFreelancer from "@/components/JobCardFreelancer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../(redux)/features/projectDataSlice"
// import { setAllProjects } from "@/app/(redux)/features/projectDataSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { MdWorkspacePremium } from "react-icons/md";
import { TbAdjustmentsStar } from "react-icons/tb";
const Home = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("Freelancer: ", freelancers);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const user = userData?.name;
  const clientId = userData?.id;
  useEffect(() => {
    const data = sessionStorage.getItem('karmsetu');
    if (data) {
      try {
        setUserData(JSON.parse(data));
      } catch (error) {
        console.error("Invalid session storage data", error);
      }
    }
  }, []);




  const projects = useSelector((state) => state.projects.allProjects);
  const [projectCount, setProjectCount] = useState({
    completedProjects: 0,
    ongoingProjects: 0,
    allProjects: 0
  })

  useEffect(() => {
    if (freelancers.length === 0) {
      const fetchFreelancers = async () => {
        try {
          const response = await fetch('/api/freelancer');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFreelancers(data.freelancers);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchFreelancers();
    }
  }, [freelancers]);






  console.log(clientId, user);
  useEffect(() => {
    if (clientId) {
      dispatch(fetchProjects(clientId));
    }
  }, [clientId, dispatch]);

  const completedProjects = useSelector((state) => state.projects.completedProjects);
  const ongoingProjects = useSelector((state) => state.projects.ongoingProjects);
  const allProjects = useSelector((state) => state.projects.allProjects);
  useEffect(() => {
    setProjectCount({
      completedProjects: completedProjects,
      ongoingProjects: ongoingProjects,
      allProjects: allProjects,
    });
  }, [completedProjects, ongoingProjects, allProjects]);


  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
            console.log("Latitude:", latitude, "Longitude:", longitude);

            try {
              const res = await fetch("/api/CpersonalDetails", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userData?.email, coordinates: { latitude, longitude } }),
              });
              console.log(res.ok ? "Coordinates updated" : "Failed to update");
            } catch (error) {
              console.log("Error updating coordinates:", error);
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    if (userData) {
      getLocation();
    }
  }, [userData]);



  const [maxBudget, setMaxBudget] = useState(1000);
  return (
    <>
      <div className="flex flex-col gap-12 mx-3 sm:mx-8 mt-5">
        <div className="flex  flex-col sm:flex-row gap-4 sm:gap-0  sm:justify-between sm:items-center">
          <span className="font-semibold text-black text-4xl">
            Welcome Back, <span className="text-primary">{user}</span> 👋
          </span>
          <div className="flex items-center">
            <Button className="flex item-center gap-1 text-white  bg-primary hover:bg-primaryho">
              <Link href="/cl/createjob">Post Job</Link>
              <span className="text-white text-xl">
                <GoPlus />
              </span>
            </Button>
          </div>
        </div>

        <div className=" w-full rounded-lg ">
          {" "}

          <div className="grid gap-4  sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Total Projects Posted
                </CardTitle>
                <TbAdjustmentsStar className="h-5 w-5  text-primary" />
              </CardHeader>
              <CardContent className="px-3">
                <div className="text-2xl font-bold text-primary">
                  {projectCount.allProjects}
                </div>
                <p className="text-xs pt-2 text-gray-400">
                  last posted on 27 July
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Active Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent className="px-3">
                <div className="text-2xl font-bold text-primary">
                  {projectCount.ongoingProjects}
                </div>
                <p className="text-xs pt-2 text-gray-400">
                  Updated on 10 August
                </p>
              </CardContent>
            </Card>
            <Card className="hidden lg:block">
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Completed Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent className="px-3">
                <div className="text-2xl font-bold text-primary">
                  {projectCount.completedProjects}
                </div>
                <p className="text-xs pt-2 text-gray-400">
                  Updated on 10 August
                </p>
              </CardContent>
            </Card>
            <Card className="hidden lg:block">
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Total Hired Freelancers
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent className="px-3">
                <div className="text-2xl font-bold text-primary">8</div>
                <p className="text-xs pt-2 text-gray-400">
                  Last hire on 20 July
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-2   w-full  rounded-lg">
          <div className="md:text-4xl text-3xl text-black font-semibold flex flex-row items-center">
            <span><MdWorkspacePremium className="text-secondaryho md:text-4xl text-3xl" /></span>
            Freelancers
          </div>

          <div className="flex flex-col lg:flex-row gap-2   justify-between">
            <div className="flex flex-row gap-2">
              <div className="bg-white max-h-10 min-w-64 flex flex-row items-center gap-1 pl-2 rounded-md ">
                <HiMiniMagnifyingGlass className="text-xl" />
                <Input
                  type="text"
                  placeholder="Search Freelancers"
                  className=" border-none px-1 rounded-md placeholder:font-medium bg-white  w-full"
                />
              </div>
              <div>
                <Button className="bg-secondaryho hover:bg-secondary focus:bg-secondary">
                  Search
                </Button>
              </div>
            </div>
            <div className="flex xl:flex-row xl:items-center items-start flex-col gap-2 ">
              <div className="flex flex-col md:flex-row  gap-2">
                <Select>
                  <SelectTrigger className="w-[180px] border border-gray-200 bg-white pl-3 rounded-md text-black font-medium shadow-sm">
                    <SelectValue className="k" placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="max-h-40 overflow-y-scroll">
                      <SelectLabel>Titles</SelectLabel>
                      <SelectItem value="Web Developer">
                        Web Developer
                      </SelectItem>
                      <SelectItem value="Android Developer">
                        Android Developer
                      </SelectItem>
                      <SelectItem value="Graphic Designer">
                        Graphic Designer
                      </SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Content Writer">
                        Content Writer
                      </SelectItem>
                      <SelectItem value="Software Engineer">
                        Software Engineer
                      </SelectItem>
                      <SelectItem value="Videographer">Videographer</SelectItem>
                      <SelectItem value="Legal Advisor">
                        Legal Advisor
                      </SelectItem>
                      <SelectItem value="Copywriter">Copywriter</SelectItem>
                      <SelectItem value="Social Media Manager">
                        Social Media Manager
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[180px] border border-gray-200 bg-white pl-3 rounded-md text-black font-medium shadow-sm">
                    <SelectValue className="k" placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="max-h-40 ">
                      <SelectLabel>Ratings</SelectLabel>
                      <SelectItem value="4.5">4.5+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="max-w-72 ">
                <div className="price-range ">
                  <span className="text-sm text-black font-medium">Budget: </span>
                  <span className="text-sm">₹</span>
                  <span className="text-sm">{maxBudget}</span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    defaultValue="1000"
                    name="maxBudget"
                    min="0"
                    max="20000"
                    step="500"
                    // oninput="this.previousElementSibling.innerText=this.value"
                    onChange={(e) => {
                      setMaxBudget(e.target.value);
                    }}
                  />
                  <div className="-mt-2 flex w-full justify-between">
                    <span className="text-sm text-gray-600">0</span>
                    <span className="text-sm text-gray-600">20000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" inline-flex flex-row flex-wrap   justify-start   gap-4">
            {freelancers.map((freelancer) => (
              <FreelancerCard
                key={freelancer._id}
                fullname={freelancer.fullname}
                professionalTitle={freelancer.professionalTitle}
                skill={freelancer.skill}
                bio={freelancer.bio}
                id={freelancer._id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
