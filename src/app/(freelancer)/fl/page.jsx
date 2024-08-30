"use client";
import { useEffect, useState } from 'react';
import JobCardFreelancer from "@/components/JobCardFreelancer";

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
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    setUserData(data);
  }, [])
  // if (userData) {
  //   setCount(count++);
  // }


  // const [count, setCount] = useState(0);
  useEffect(async () => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
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

    await getLocation();
    const updateCoordinates = async () => {
      try {
        const res = await fetch('/api/FpersonalDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data?.email, coordinates })
        });
        console.log(res.ok ? 'Coordinates updated' : 'Failed to update');
      } catch {
        console.log('Error updating coordinates');
      }
    };
    await updateCoordinates();
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
  return (
    <>
      <span className="font-bold text-4xl">Home</span>
      <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg">

      </div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg" style={{
        height: "auto", display: "flex", width: "100%", flexDirection: "row", flexWrap: "wrap", gap: "12px",
        padding: "12px"
      }}>
        {projects.length > 0 ? (
          projects.map(project => (
            <JobCardFreelancer key={project._id} project={project} />
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
    </>
  );
}
