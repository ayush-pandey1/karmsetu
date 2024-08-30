"use client";

import JobCardFreelancer from '@/components/JobCardFreelancer';
import React, { useEffect, useState } from 'react'

const NearbyFreelancersPage = () => {

  const [nearByProject, setNearByProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState();

  useEffect(() => {
    const data1 = JSON.parse(sessionStorage.getItem('karmsetu'));
    const fetchNearbyFreelancers = async () => {
      try {
        const response = await fetch(`/api/nearby/freelancer/${data1?.id}`);
        const data = await response.json();
        setNearByProject(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nearby freelancers:', error);
        setLoading(false);
      }
    };

    fetchNearbyFreelancers();
  }, []);

  if (loading) {
    return <div>Loading nearby freelancers...</div>;
  }
  console.log(nearByProject);

  return (<>
    <div>NearbyFreelancersPage</div>
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
  )
}

export default NearbyFreelancersPage