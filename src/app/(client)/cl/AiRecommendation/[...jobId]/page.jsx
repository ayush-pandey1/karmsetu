"use client";

import { useParams } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Recommendation = () => {
    const { jobId } = useParams();
    console.log("IDD: ", jobId[0]);
    const id = jobId[0];
    const [matchProject, setMatchProject] = useState([]); // Matched data stored here!!!
    const [matchProjectId, setMatchProjectId] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobData = async (id) => {
        console.log("id: ", id);
        try {
            if (!id) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`);
            if (response.ok) {
                const data = await response.json();
                setMatchProject(prev => [...prev, data.user]);
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

    const fetchProjectRecommendations = async (Id) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_AI_API}/job/${Id}`;

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
        // const storedData = sessionStorage.getItem('karmsetu');
        // if (storedData) {
        //     try {
        //         const parsedData = JSON.parse(storedData);
        if (id) {
            fetchProjectRecommendations(id);
        }
        //     console.log('Parsed session data:', parsedData);
        // } catch (error) {
        //     console.error('Invalid session storage data:', error);
        // }
        // }
    }, [id]);

    // useEffect(() => {
    //     console.log("Matching: ", matchProject);
    // }, [matchProject])

    return (
        <div>
            <h2>Recommendations</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {matchProject && matchProject.map((user, index) => (
                    <li key={index}>{user?.fullname || `User ID: ${matchProjectId[index]}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendation;
