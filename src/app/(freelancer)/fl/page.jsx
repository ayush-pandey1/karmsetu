"use client";
import { useEffect, useState } from "react";
import JobCardFreelancer from "@/components/JobCardFreelancer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbAdjustmentsStar } from "react-icons/tb";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState();
  // const [count, setCount] = useState(0);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data);
  }, []);
  // if (userData) {
  //   setCount(count++);
  // }


  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);
  }, [])
  // const [count, setCount] = useState(0);
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data);


    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
            console.log("Latitude:", latitude, "Longitude:", longitude);
          },
          (error) => {
            console.error("Error getting geolocation: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };


    getLocation();
    const updateCoordinates = async () => {
      try {
        const res = await fetch('/api/FpersonalDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data1?.email, coordinates })
        });
        console.log(res.ok ? 'Coordinates updated' : 'Failed to update');
      } catch {
        console.log('Error updating coordinates');
      }
    };
    updateCoordinates();
  }, []);


  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/project/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

  }, []);

  if (!projects) {
    fetchProjects();
  }
  const [maxBudget, setMaxBudget] = useState(1000);
  return (
    <>
      <div className="flex p-4 flex-col gap-3">
        <span className="font-semibold text-black text-4xl mb-5">
          Welcome Back,{" "}
          <span className="text-primary font-bold">{"Ayush"}</span> 👋
        </span>
        <div className=" w-full rounded-lg ">
          {" "}
          <div className="grid gap-4  sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Total Gigs Completed
                </CardTitle>
                <TbAdjustmentsStar className="h-5 w-5  text-primary" />
              </CardHeader>
              <CardContent className="px-3">
                <div className="text-2xl font-bold text-primary">{"99"}</div>
                <p className="text-xs pt-2 text-gray-400">
                  last posted on 27 July
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Active Gigs
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
                <div className="text-2xl font-bold text-primary">{"89"}</div>
                <p className="text-xs pt-2 text-gray-400">
                  Updated on 10 August
                </p>
              </CardContent>
            </Card>
            <Card className="hidden lg:block">
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Completed Gigs
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
                <div className="text-2xl font-bold text-primary">{"79"}</div>
                <p className="text-xs pt-2 text-gray-400">
                  Updated on 10 August
                </p>
              </CardContent>
            </Card>
            <Card className="hidden lg:block">
              <CardHeader className="pt-4 pb-0 px-3  flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-md sm:text-lg md:text-xl  font-semibold">
                  Total Revenue Made
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
                <div className="text-2xl font-bold text-primary">{"25800"}</div>
                <p className="text-xs pt-2 text-gray-400">
                  Last hire on 20 July
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="md:text-4xl text-3xl text-black font-semibold flex flex-row items-center">
            
            <p className="px-3  border-l-4 border-l-secondary font-bold">
              {" "}
              Gigs
            </p>
          </div>

        <div className=" flex flex-col lg:flex-row gap-2    items-center border-double bg-white shadow-sm border border-gray-200 p-2 w-full h-full rounded-lg">
          <div className="flex flex-col lg:flex-row gap-2   justify-between w-full">
            <div className="flex flex-row gap-2 items-center">
              <div className="bg-white border border-gray-200  max-h-10 min-w-48 flex flex-row items-center gap-1 pl-2 rounded-md ">
                <HiMiniMagnifyingGlass className="text-xl" />
                <Input
                  type="text"
                  placeholder="Search Freelancers"
                  className=" border-none px-1 rounded-md placeholder:font-medium bg-white  w-full"
                />
              </div>
              <div>
                <Button className="bg-secondaryho hover:bg-secondary focus:bg-secondary  ">
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
                  <span className="text-sm text-black font-medium">
                    Budget:{" "}
                  </span>
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
        </div>
       
        <div className="flex justify-between">
          <div className=" inline-flex flex-row  justify-center sm:justify-start flex-wrap gap-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <JobCardFreelancer key={project._id} project={project} />
              ))
            ) : (
              <p>No projects available</p>
            )}
          </div>
        </div>

        
      </div>
    </>
  );
}
