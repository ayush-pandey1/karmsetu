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
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, filterByBudget, filterByCategory, filterBySearch } from "@/app/(redux)/features/freelancerProjects"
import Loader2 from "@/components/Loader2";

export default function Home() {
  const dispatch = useDispatch();
  const [projectCounts, setProjectCounts] = useState({
    allProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0
  });
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState();
  // const [count, setCount] = useState(0);
  // const router = useRouter();
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    console.log(data, 'Session Storage Data');
    if (data) {
      setUserData(data);
    }
  }, []);

  const allProject = useSelector((state) => state.freelancer.allFreelancerProjects);
  const completedProject = useSelector((state) => state.freelancer.CompletedProjects);
  const ongoingProject = useSelector((state) => state.freelancer.OngoingProjects);

  useEffect(() => {
    setProjectCounts({
      completedProjects: completedProject,
      ongoingProjects: ongoingProject,
      allProjects: allProject,
    });
    setLoading(false);
  }, [completedProject, ongoingProject, allProject]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);


  // if (userData) {
  //   setCount(count++);
  // }


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
            //console.log("Latitude:", latitude, "Longitude:", longitude);
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

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "budget":
        //console.log(value);
        dispatch(filterByBudget(value));
        break;
      case "category":
        //console.log(value);
        dispatch(filterByCategory(value));
        break;
      case "search":
        //console.log(value);
        dispatch(filterBySearch(value));
        break;
      default:
        break;
    }
  };

  
  const filteredProjectsData = useSelector((state) => state.freelancer.filteredProjects);
  useEffect(() => {
    setFilteredProjects(filteredProjectsData);
    setLoading2(false);
  }, [filteredProjectsData]);
  // console.log(filteredProjectsData, "From FL page Redux Store");
  // console.log(filteredProjects, "From FL page State Variable");

  const [maxBudget, setMaxBudget] = useState(1000);
  return (
    <>
      <div className="flex p-4 flex-col gap-3">
        {loading2 ? (
          <Loader2/>
        ) : (
          <div>
          <span className="font-semibold text-black text-4xl mb-5">
          Welcome Back
          <span className="text-primary font-bold">{userData?.name}</span> 👋
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
                <div className="text-2xl font-bold text-primary">{projectCounts.allProjects}</div>
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
                <div className="text-2xl font-bold text-primary">{projectCounts.ongoingProjects}</div>
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
                <div className="text-2xl font-bold text-primary">{projectCounts.completedProjects}</div>
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
                  name="searchInput"
                  onChange={(e) => handleFilterChange("search", e.target.value)}
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
                <Select
                  name="titleSelect"
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger className="w-[180px] border border-gray-200 bg-white pl-3 rounded-md text-black font-medium shadow-sm">
                    <SelectValue className="k" placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="max-h-40 overflow-y-scroll">
                      <SelectLabel>Titles</SelectLabel>
                      <SelectItem value="web-development">
                        Web Developer
                      </SelectItem>
                      <SelectItem value="mobile-app-development">
                        Android Developer
                      </SelectItem>
                      <SelectItem value="graphic-design">
                        Graphic Designer
                      </SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Content Writer">
                        Content Writer
                      </SelectItem>
                      <SelectItem value="software-development">
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

                <Select
                  name="ratingSelect"
                  onValueChange={(value) => handleFilterChange("rating", value)}
                >
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
                      handleFilterChange("budget", e.target.value);
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
            {loading2 ? (
              <Loader2/>
            ) : (
              filteredProjects.length > 0 ? (
                filteredProjects.map((filteredProject) => (
                  <JobCardFreelancer key={filteredProject._id} project={filteredProject} />
                ))
              ) : (
                <p>No projects available</p>
              )   
            )
          }
          </div>
        </div>


        </div>
        )
      }
      
      </div>
    </>
  );
}
