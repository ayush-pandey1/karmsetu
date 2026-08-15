"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUserData as setChatUserData } from "@/app/(redux)/features/chatDataSlice";
import FreelancerCard from "@/components/FreelancerCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GrMap } from "react-icons/gr";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Loader2 from "@/components/Loader2";
import Image from "next/image";

const MapComponent = dynamic(() => import("@/components/CmapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] md:h-[500px] w-full rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
      <Loader2 />
    </div>
  ),
});

const HeatMapComponent = dynamic(
  () => import("@/components/HeatMapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] md:h-[500px] w-full rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
        <Loader2 />
      </div>
    ),
  }
);

const NearbyFreelancersPage = () => {
  const dispatch = useDispatch();
  const [freelancers, setFreelancers] = useState([]);
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
  const [heatmapStatus, setHeatmapStatus] = useState(false);

  const distances = [2, 5, 10, 15, 25, 50, 100];

  const handleMapStatus = () => {
    setHeatmapStatus((prev) => !prev);
  };

  const handleDistanceChange = (value) => {
    setSelectedDistance(Number(value));
  };

  const handleFreelancerClick = (id) => {
    setSelectedFreelancerId(id);
  };

  // 1. Get user data from session storage & sync to Redux
  useEffect(() => {
    const raw = sessionStorage.getItem("karmsetu");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserData(parsed);
        dispatch(setChatUserData(parsed));
      } catch (err) {
        console.error("Invalid session storage data", err);
      }
    }
  }, [dispatch]);

  // 2. Fetch user's current geolocation & update backend coordinates
  useEffect(() => {
    const syncLocation = async (lat, lng) => {
      setCoordinates({ latitude: lat, longitude: lng });
      if (userData?.email) {
        try {
          await fetch("/api/CpersonalDetails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userData.email,
              coordinates: { latitude: lat, longitude: lng },
            }),
          });
        } catch (error) {
          console.error("Error updating coordinates in DB:", error);
        }
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          syncLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [userData?.email]);

  // 3. Fetch nearby freelancers when clientId or selectedDistance changes
  const fetchNearby = useCallback(async () => {
    const clientId = userData?.id;
    if (!clientId) return;

    try {
      setLoading(true);
      // Fetch filtered range for normal map / cards
      const res = await fetch(
        `/api/nearby/client/${clientId}?distance=${selectedDistance}`
      );
      const data = await res.json();
      if (res.ok) {
        setFreelancers(data.nearbyFreelancers || []);
      } else {
        console.error("Error fetching nearby freelancers:", data.error);
      }

      // Fetch wider range for heatmap
      const resAll = await fetch(
        `/api/nearby/client/${clientId}?distance=200`
      );
      const dataAll = await resAll.json();
      if (resAll.ok) {
        setAllFreelancers(dataAll.nearbyFreelancers || []);
      }
    } catch (error) {
      console.error("Error fetching nearby freelancers:", error);
    } finally {
      setLoading(false);
    }
  }, [userData?.id, selectedDistance]);

  useEffect(() => {
    if (userData?.id) {
      fetchNearby();
    }
  }, [userData?.id, fetchNearby]);

  return (
    <div className="flex flex-col gap-6 mx-3 sm:mx-10 mt-4 mb-10">
      <div className="flex flex-col gap-1">
        <div className="text-black font-bold text-xl sm:text-2xl border-l-4 border-l-green-500 px-3 leading-none">
          Discover Freelancers Near You
        </div>
        <p className="font-medium text-xs sm:text-sm text-gray-500 leading-normal pl-4">
          Find skilled professionals in your area and hire with confidence
        </p>
      </div>

      {/* Map Section */}
      <div className="w-full">
        {coordinates.latitude !== 0 ? (
          heatmapStatus ? (
            <HeatMapComponent
              myCoordinate={coordinates}
              othersCoordinates={allFreelancers}
            />
          ) : (
            <MapComponent
              myCoordinate={coordinates}
              othersCoordinates={freelancers}
              distance={selectedDistance}
              selectedFreelancerId={selectedFreelancerId}
            />
          )
        ) : (
          <div className="h-[300px] md:h-[400px] w-full rounded-xl border border-gray-200 flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2">
            <Loader2 />
            <p className="text-sm font-medium">Getting your location...</p>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <GrMap className="text-primary text-2xl" />
          <span className="text-black font-bold text-lg sm:text-xl">
            Freelancers within{" "}
            <span className="text-green-600">{selectedDistance} km</span> range
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="distance" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Range:
            </Label>
            <Select
              value={String(selectedDistance)}
              onValueChange={handleDistanceChange}
            >
              <SelectTrigger className="w-[120px] bg-white border border-gray-200 shadow-sm">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {distances.map((dist) => (
                  <SelectItem key={dist} value={String(dist)}>
                    {dist} km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
            <Switch
              id="heatmap-view"
              checked={heatmapStatus}
              className="data-[state=checked]:bg-sky-500"
              onCheckedChange={handleMapStatus}
            />
            <Label htmlFor="heatmap-view" className="text-sm font-medium text-gray-700 cursor-pointer">
              Heatmap View
            </Label>
          </div>
        </div>
      </div>

      {/* Freelancer Cards Grid */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 />
          </div>
        ) : freelancers && freelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancers.map((freelancer) => (
              <div
                key={freelancer._id}
                className={`cursor-pointer transition-all duration-200 rounded-lg ${
                  selectedFreelancerId === freelancer._id
                    ? "ring-2 ring-green-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => handleFreelancerClick(freelancer._id)}
              >
                <FreelancerCard
                  fullname={freelancer.fullname}
                  professionalTitle={freelancer.professionalTitle}
                  skill={freelancer.skill}
                  bio={freelancer.bio}
                  id={freelancer._id}
                  rating={freelancer.rating || "4"}
                  cost={freelancer.Cost}
                  connection={freelancer.connection}
                  imageLink={freelancer.imageLink}
                  portfolioDetails={freelancer.portfolioDetails || []}
                  onClick={handleFreelancerClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-12 bg-white rounded-xl border border-gray-200">
            <Image
              src="/quiteplace.svg"
              alt="No freelancers nearby"
              width={120}
              height={120}
              className="size-48 opacity-75 mb-3"
            />
            <p className="text-gray-500 text-lg font-medium">
              No freelancers found within {selectedDistance} km
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try increasing the search range above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFreelancersPage;

