"use client";
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("@/components/CmapComponent"), {
  ssr: false,
});
const HeatMapComponent = dynamic(
  () => import("@/components/HeatMapComponent"),
  { ssr: false }
);
import FreelancerCard from "@/components/FreelancerCard";
// import MapComponent from "@/components/CmapComponent";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GrMap } from "react-icons/gr";
import { PiMapPinAreaFill } from "react-icons/pi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Loader2 from "@/components/Loader2";
// import HeatMapComponent from "@/components/HeatMapComponent";
// import clHeatMap from "@/components/clHeatMap";

const NearbyFreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);

  const distances = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [heatmapStatus, setHeatmapStatus] = useState(false);
  const handelMapStatus = () => {
    setHeatmapStatus(!heatmapStatus);
  };

  const handleDistanceChange = (event) => {
    setSelectedDistance(Number(event.target.value));
  };

  const handleFreelancerClick = (id) => {
    setSelectedFreelancerId(id);
  };

  useEffect(() => {
    const data1 = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data1);
    const id = data1?.id;

    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/nearby/client/${id}?distance=${selectedDistance}`
        );
        const result = await response.json();

        if (response.ok) {
          setFreelancers(result.nearbyFreelancers);
        } else {
          console.error("Error fetching freelancers:", result.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreelancers();
    }
  }, [selectedDistance]);

  useEffect(() => {
    const data1 = JSON.parse(sessionStorage.getItem("karmsetu"));
    setUserData(data1);
    const id = data1?.id;

    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nearby/client/${id}?distance=2000`);
        const result = await response.json();

        if (response.ok) {
          console.log("newnewnewn: ", result.nearbyFreelancers);
          setAllFreelancers(result.nearbyFreelancers);
        } else {
          console.error("Error fetching freelancers:", result.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreelancers();
    }
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
    getLocation();

    if (userData) {
      getLocation();
    }
  }, [userData]);

  if (loading) {
    return <div><Loader2 /></div>;
  }

  return (
    <>
      <div className="flex flex-col gap-5  mx-3 sm:mx-10 mt-2">
        <div className="flex flex-col gap-1">
          <div className="text-black font-bold text-lg sm:text-2xl  border-l-4 border-l-green-500 px-2 leading-none ">
            Discover Freelancers Near You
          </div>
          <div className=" font-medium text-xs sm:text-md  leading-none pl-[14px]">
            Find skilled professionals in your area and hire with confidence
          </div>
        </div>
        <div className="App">
          {/* <h1>Nearby</h1> */}
          {coordinates.latitude ? (
            <>
              {/* <clHeatMap myCoordinate={coordinates}
              othersCoordinates={freelancers} /> */}
              {heatmapStatus ? (
                <HeatMapComponent
                  myCoordinate={coordinates}
                  othersCoordinates={allFreelancers}
                />
              ) : (
                <MapComponent
                  myCoordinate={coordinates}
                  othersCoordinates={freelancers}
                  distance={selectedDistance}
                  selectedFreelancerId={selectedFreelancerId} // Pass the selected ID to MapComponent
                />
              )}
            </>
          ) : (
            <h1>Page is loading...</h1>
          )}
        </div>

        <div className="flex flex-row items-center gap-1">
          <Switch
            id="heatmap-view"
            className="data-[state=checked]:bg-sky-500"
            onCheckedChange={handelMapStatus}
          />
          <Label htmlFor="heatmap-view">Heatmap View</Label>
        </div>

        <div>
          <span className="text-black font-bold text-xl md:text-3xl  flex flex-row items-center gap-1">
            <GrMap className="text-primary" />
            Freelancers within{" "}
            <span className="text-green-600">{selectedDistance} km</span> range
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
          {freelancers && freelancers.length > 0 ? (
            freelancers.map((freelancer) => (
              <FreelancerCard
                key={freelancer?._id}
                fullname={freelancer?.fullname}
                professionalTitle={freelancer?.professionalTitle}
                skill={freelancer?.skill}
                bio={freelancer?.bio}
                id={freelancer?._id}
                onClick={handleFreelancerClick} // Pass the click handler
              />
            ))
          ) : (
            <p>No freelancers available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NearbyFreelancersPage;
