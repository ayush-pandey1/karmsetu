"use client";

import FmapComponent from '@/components/FmapComponent';
import JobCardFreelancer from '@/components/JobCardFreelancer';
import React, { useEffect, useState } from 'react';

const NearbyFreelancersPage = () => {
  const [nearByProject, setNearByProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [selectedDistance, setSelectedDistance] = useState(5);
  const distances = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleDistanceChange = (event) => {
    setSelectedDistance(Number(event.target.value));
  };

  useEffect(() => {
    const fetchNearbyFreelancers = async () => {
      const data1 = JSON.parse(sessionStorage.getItem('karmsetu'));
      const id = data1?.id;

      if (id) {
        // loading(true);
        try {
          const response = await fetch(`/api/nearby/freelancer/${id}?distance=${selectedDistance}`);
          if (response.ok) {
            const data = await response.json();
            setNearByProject(data);
          } else {
            console.error('Failed to fetch data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching nearby freelancers:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNearbyFreelancers();
  }, [selectedDistance]);

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
    return <div>Loading nearby projects...</div>;
  }

  return (
    <>
      <div>NearbyFreelancersPage</div>
      <div className="App">
        <h1>My Leaflet Map</h1>
        {coordinates.latitude ? (
          <FmapComponent
            myCoordinate={coordinates}
            othersCoordinates={nearByProject}
            distance={selectedDistance}
          />
        ) : (
          <h1>Page is loading...</h1>
        )}
      </div>
      <div>
        <label htmlFor="distance">Select distance (km): </label>
        <select id="distance" value={selectedDistance} onChange={handleDistanceChange}>
          {distances.map((distance) => (
            <option key={distance} value={distance}>
              {distance} km
            </option>
          ))}
        </select>
        <p>Selected distance: {selectedDistance} km</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "2", width: "100%", flexWrap: "wrap" }}>
        {nearByProject.length > 0 ? (
          nearByProject.map(project => (
            <JobCardFreelancer key={project._id} project={project} />
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </>
  );
};

export default NearbyFreelancersPage;