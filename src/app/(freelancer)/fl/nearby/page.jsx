"use client";

import FmapComponent from "@/components/FmapComponent";
import HeatMapComponent from "@/components/HeatMapComponent";
import JobCardFreelancer from "@/components/JobCardFreelancer";
import Loader2 from "@/components/Loader2";
import React, { useEffect, useState } from "react";
import { GrMap } from "react-icons/gr";
import "../style.css"

const NearbyFreelancersPage = () => {
  const [nearByProject, setNearByProject] = useState([]);
  const [allProject, setAllProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [selectedDistance, setSelectedDistance] = useState(5);
  const distances = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleDistanceChange = (event) => {
    setSelectedDistance(Number(event.target.value));
  };

  useEffect(() => {
    const fetchNearbyFreelancers = async () => {
      const data1 = JSON.parse(sessionStorage.getItem("karmsetu"));
      const id = data1?.id;
      // console.log(id," : ", data1);

      if (id) {
        // loading(true);
        try {
          const response = await fetch(
            `/api/nearby/freelancer/${id}?distance=${selectedDistance}`
          );
          if (response.ok) {
            const data = await response.json();
            setNearByProject(data);
          } else {
            console.error("Failed to fetch data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching nearby freelancers:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNearbyFreelancers();
  }, [selectedDistance]);
  useEffect(() => {
    const fetchNearbyFreelancers = async () => {
      const data1 = JSON.parse(sessionStorage.getItem("karmsetu"));
      const id = data1?.id;
      // console.log(id," : ", data1);

      if (id) {
        // loading(true);
        try {
          const response = await fetch(
            `/api/nearby/freelancer/${id}?distance=2000`
          );
          if (response.ok) {
            const data = await response.json();
            setAllProject(data);
          } else {
            console.error("Failed to fetch data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching nearby freelancers:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNearbyFreelancers();
  }, []);


  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full">
        <Loader2 />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5  mx-3 sm:mx-10 mt-2">
        <div className="flex flex-col gap-2">
          <div className="text-black font-bold text-lg sm:text-2xl  border-l-4 border-l-sky-500 px-2 leading-none ">
            Discover Projects in{" "}
            <span className="underline-nearby relative ">
              Proximity
            </span>
          </div>
          <div className=" font-medium text-xs sm:text-md  leading-none pl-[14px]">
            Find projects/gigs in your area.
          </div>
        </div>
        <div className="App">
          {/* <h1>My Leaflet Map</h1> */}
          {coordinates.latitude ? (
            <>
              <HeatMapComponent myCoordinate={coordinates}
                othersCoordinates={allProject} />
              <FmapComponent
                myCoordinate={coordinates}
                othersCoordinates={nearByProject}
                distance={selectedDistance}
              />
            </>
          ) : (
            <h1>Page is loading...</h1>
          )}
        </div>

        <div>
          <span className="text-black font-bold text-xl md:text-3xl  flex flex-row items-center gap-1">
            <GrMap className="text-sky-500" />
            Projects within{" "}
            <span className="text-sky-500 ">{selectedDistance} km</span> range
          </span>
        </div>

        <div>
          <label htmlFor="distance" className="text-black font-medium text-xl">
            Select distance (km):{" "}
          </label>
          <select
            id="distance"
            value={selectedDistance}
            onChange={handleDistanceChange}
            className=" rounded-md text-lg px-2 py-1 border "
          >
            {distances.map((distance) => (
              <option key={distance} value={distance} className="">
                {distance} km
              </option>
            ))}
          </select>

        </div>


        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2",
            width: "100%",
            flexWrap: "wrap",
          }}
          className="gap-2 mb-3"
        >
          {nearByProject.length > 0 ? (
            nearByProject.map((project) => (
              <JobCardFreelancer key={project._id} project={project} />
            ))
          ) : (
            <p>No projects available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NearbyFreelancersPage;
