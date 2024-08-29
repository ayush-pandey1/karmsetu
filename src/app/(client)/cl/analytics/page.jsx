"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import Link from "next/link";
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
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

const AnalyticsPage = () => {
  // Dummy data
  const projectCount = {
    allProjects: 25,
    ongoingProjects: 10,
    completedProjects: 15,
    totalSpend: 5000,
    avgProjectCost: 200,
    avgRating: 4.5,
    totalFreelancers: 12,
  };

  // Dummy charts data
  const projectStatusData = [
    {
      name: "Completed",
      value: projectCount.completedProjects,
      color: "#4CAF50", // Green
    },
    { name: "Ongoing", value: projectCount.ongoingProjects, color: "#FFC107" }, // Amber
    { name: "Pending", value: 8, color: "#F44336" }, // Red
  ];

  const budgetData = [
    { name: "Freelancer Fees", budget: 3000, actual: 2500 },
    { name: "Additional Costs", budget: 2000, actual: 1800 },
  ];

  const freelancerPerformanceData = [
    { name: "Freelancer 1", rating: 4.7, cost: 1000 },
    { name: "Freelancer 2", rating: 4.5, cost: 1200 },
    { name: "Freelancer 3", rating: 4.8, cost: 800 },
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5    bg-white p-4 rounded-lg shadow-lg">
        <div className="text-black text-2xl md:text-3xl font-semibold mb-2 flex flex-row gap-1 items-center leading-none">
        <TbDeviceDesktopAnalytics className="text-green-500" />
          Analytics Overview
        </div>

        {/* Overall Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Spend",
              value: `$${projectCount.totalSpend}`,
              lastUpdated: "27 July",
            },
            {
              title: "Total Projects",
              value: projectCount.allProjects,
              lastUpdated: "10 August",
            },
            {
              title: "Active Projects",
              value: projectCount.ongoingProjects,
              lastUpdated: "10 August",
            },
            {
              title: "Completed Projects",
              value: projectCount.completedProjects,
              lastUpdated: "10 August",
            },
            {
              title: "Total Freelancers Hired",
              value: projectCount.totalFreelancers,
              lastUpdated: "10 August",
            },
            {
              title: "Average Project Cost",
              value: `$${projectCount.avgProjectCost}`,
              lastUpdated: "10 August",
            },
            {
              title: "Average Rating",
              value: projectCount.avgRating,
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

        {/* Flexbox container for horizontal alignment */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Project Status Overview */}
          <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <div className="text-xl font-semibold text-black mb-4">
              Project Status Overview
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

          {/* Budget vs. Actual Spend */}
          <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <div className="text-xl font-semibold text-black mb-4">
              Budget vs. Actual Spend
            </div>
            <div className="flex justify-center items-center h-64">
              <ResponsiveContainer width="70%" height="100%">
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget">
                    <LabelList dataKey="budget" position="top" />
                  </Bar>
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual Spend">
                    <LabelList dataKey="actual" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Freelancer Performance */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="text-xl font-semibold text-black mb-4">
            Freelancer Ratings
          </div>
          <div className="flex justify-center items-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={freelancerPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rating" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placeholder for future sections */}
        {/* You can add more sections or charts as needed */}
      </div>
    </>
  );
};

export default AnalyticsPage;
