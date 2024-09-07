"use client";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import {useSelector} from "react-redux"

const FreelancerAnalyticsPage = () => {
  const [projectCounts, setProjectCounts] = useState({
    allProjects: 0,
    completedProjects : 0,
    ongoingProjects : 0,
    pendingProjects : 0
    });

  // Dummy data
  const freelancerStats = {
    totalEarnings: 12000,
    avgRating: 4.8,
    totalClients: 15,
  };
  const [UserRating, setUserRating] = useState(0);
  const [freelancerId, setFreelancerId] = useState("");
  
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    console.log(data);
    setFreelancerId(data?.id);
  }, [])

  useEffect(() => {
    if (!freelancerId) return; // Exit early if freelancerId is not available

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${freelancerId}`);
        const rating = response.data.user.rating || 3.5;
        setUserRating(rating);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [freelancerId]);


  const allProject = useSelector((state)=> state.freelancer.allFreelancerProjects);
  const completedProject = useSelector((state)=> state.freelancer.CompletedProjects);
  const ongoingProject = useSelector((state)=> state.freelancer.OngoingProjects);

  useEffect(() => {
    setProjectCounts({
      completedProjects: completedProject,
      ongoingProjects: ongoingProject,
      allProjects: allProject,
      pendingProjects : (allProject - (completedProject + ongoingProject))
    });
  }, [completedProject, ongoingProject, allProject]);


  const earningsData = [
    { name: "Jan", earnings: 1200 },
    { name: "Feb", earnings: 1500 },
    { name: "Mar", earnings: 1400 },
    { name: "Apr", earnings: 1800 },
    { name: "May", earnings: 2000 },
  ];

  const projectStatusData = [
    {
      name: "Completed",
      value: projectCounts.completedProjects == 0? 12 : projectCounts.completedProjects,
      color: "#4CAF50",
    },
    {
      name: "Ongoing",
      value: projectCounts.ongoingProjects==0? 5 : projectCounts.ongoingProjects,
      color: "#FFC107",
    },
    { name: "Pending", value: projectCounts.pendingProjects == 0 ? 6 : projectCounts.pendingProjects, color: "#F44336" },
  ];

  const hourlyRateData = [
    { name: "Web Development", rate: 50 },
    { name: "Graphic Design", rate: 45 },
    { name: "Content Writing", rate: 40 },
    { name: "SEO", rate: 55 },
  ];

  const clientRatingsData = [
    { name: "Client 1", rating: 4.9 },
    { name: "Client 2", rating: 4.8 },
    { name: "Client 3", rating: 4.7 },
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-8 mx-4 sm:mx-8 mt-5 bg-white p-4 rounded-lg shadow-lg">
        <div className="text-black text-4xl font-semibold mb-4">
          Freelancer Analytics Overview
        </div>

        {/* Overview Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Total Earnings",
              value: `$${freelancerStats.totalEarnings}`,
              lastUpdated: "27 July",
            },
            {
              title: "Active Projects",
              value: projectCounts.ongoingProjects,
              lastUpdated: "10 August",
            },
            {
              title: "Completed Projects",
              value: projectCounts.completedProjects,
              lastUpdated: "10 August",
            },
            {
              title: "Average Rating",
              value: UserRating ? UserRating :freelancerStats.avgRating,
              lastUpdated: "10 August",
            },
            {
              title: "Total Clients",
              value: freelancerStats.totalClients,
              lastUpdated: "10 August",
            },
            {
              title: "Total Projects",
              value: projectCounts.allProjects,
              lastUpdated: "10 August",
            },
          ].map((item, index) => (
            <Card key={index} className="bg-gray-50 border border-gray-200">
              <CardHeader className="pt-4 pb-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl md:text-2xl font-semibold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {item.value}
                </div>
                <p className="text-xs pt-2 text-gray-400">
                  Last updated on {item.lastUpdated}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Charts */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Earnings Over Time */}
          <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <div className="text-xl font-semibold text-black mb-4">
              Earnings Over Time
            </div>
            {isClient && (
              <div className="flex justify-center items-center h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="earnings" stroke="#4F46E5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Project Status */}
          <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <div className="text-xl font-semibold text-black mb-4">
              Project Status
            </div>
            {isClient && (
              <div className="flex justify-center items-center h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Charts */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hourly Rate vs. Project Type */}
          <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <div className="text-xl font-semibold text-black mb-4">
              Hourly Rate vs. Project Type
            </div>
            {isClient && (
              <div className="flex justify-center items-center h-64">
                <ResponsiveContainer width="80%" height="100%">
                  <BarChart data={hourlyRateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis type="category" dataKey="name" />
                    <XAxis type="number" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" fill="#8884d8" name="Hourly Rate">
                      <LabelList dataKey="rate" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Client Ratings */}
          <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <div className="text-xl font-semibold text-black mb-4">
              Client Ratings
            </div>
            {isClient && (
              <div className="flex justify-center items-center h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientRatingsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis type="category" dataKey="name" />
                    <XAxis type="number" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rating" fill="#82ca9d" name="Rating">
                      <LabelList dataKey="rating" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerAnalyticsPage;
