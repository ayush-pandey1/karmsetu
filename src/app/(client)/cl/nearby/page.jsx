"use client"
import FreelancerCard from '@/components/FreelancerCard';
import MapComponent from '@/components/CmapComponent';
import React, { useEffect, useState } from 'react';

const NearbyFreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);

  const distances = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleDistanceChange = (event) => {
    setSelectedDistance(Number(event.target.value));
  };

  const handleFreelancerClick = (id) => {
    setSelectedFreelancerId(id);
  };

  useEffect(() => {
    const data1 = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data1);
    const id = data1?.id;

    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nearby/client/${id}?distance=${selectedDistance}`);
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
    return <div>Loading nearby freelancers...</div>;
  }

  return (
    <>
      <div>NearbyFreelancersPage</div>
      <div className="App">
        <h1>My Leaflet Map</h1>
        {coordinates.latitude ? (
          <MapComponent
            myCoordinate={coordinates}
            othersCoordinates={freelancers}
            distance={selectedDistance}
            selectedFreelancerId={selectedFreelancerId} // Pass the selected ID to MapComponent
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
        {freelancers.length > 0 ? (
          freelancers.map(freelancer => (
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
    </>
  );
}

export default NearbyFreelancersPage;
