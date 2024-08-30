"use client"
import FreelancerCard from '@/components/FreelancerCard'
import React, { useEffect, useState } from 'react'

const NearbyFreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data1 = JSON.parse(sessionStorage.getItem('karmsetu'));
    const id = data1?.id;

    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nearby/client/${id}`);
        const result = await response.json();

        if (response.ok) {
          setFreelancers(result.nearbyFreelancers);
          console.log("Fetched freelancers:", result.nearbyFreelancers);
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


  if (loading) {
    // console.log("freee: ", freelancers);
    return <div>Loading nearby freelancers...</div>;
  }


  return (<>
    <div>NearbyFreelancersPage</div>
    <div style={{ display: "flex", flexDirection: "row", gap: "2", width: "100%", flexWrap: "wrap" }}>

      {freelancers.length > 0 ? (
        freelancers.map(freelancer => (
          <FreelancerCard fullname={freelancer?.fullname} professionalTitle={freelancer?.professionalTitle} skill={freelancer?.skill} bio={freelancer?.bio} id={freelancer?._id} />
        ))
      ) : (
        <p>No projects available</p>
      )}


    </div>
  </>
  )
}

export default NearbyFreelancersPage