"use client";
import { useEffect, useState } from 'react';
import JobCardFreelancer from "@/components/JobCardFreelancer";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/project/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProjects(data.projects || []); // Store projects data in state
      } catch (error) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    fetchProjects(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs once on component mount

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
