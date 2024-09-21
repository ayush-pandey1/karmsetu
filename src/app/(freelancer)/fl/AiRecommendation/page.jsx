"use client";

import React, { useEffect, useState } from 'react';

const Recommendation = () => {
    const [matchProject, setMatchProject] = useState([]); // Matched project data stored here!!!
    const [matchProjectId, setMatchProjectId] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobData = async (id) => {
        try {
            if (!id) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${id}`);
            if (response.ok) {
                const data = await response.json();
                setMatchProject(prev => [...prev, data.project]);
                return;
            }

            throw new Error('Network response was not ok');
        } catch (error) {
            console.error('Error fetching job data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFreelancerRecommendations = async (profileId) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_AI_API}/freelancer/${profileId}`;

        setLoading(true);

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.detail}`);
            }

            const data = await response.json();
            setMatchProjectId(data._id);

            await Promise.all(data._id.map((id) => fetchJobData(id)));

            console.log('Data of freelancer matches:', data);
            return data;
        } catch (error) {
            console.error('Error fetching freelancer recommendations:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('karmsetu');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                fetchFreelancerRecommendations(parsedData?.id);
                console.log('Parsed session data:', parsedData);
            } catch (error) {
                console.error('Invalid session storage data:', error);
            }
        }
    }, []);

    // useEffect(() => {
    //     console.log("Matching: ", matchProject);
    // }, [matchProject])

    return (
        <div>
            <h2>Recommendations</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {matchProject && matchProject.map((project, index) => (
                    <li key={index}>{project.title || `Project ID: ${matchProjectId[index]}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendation;
