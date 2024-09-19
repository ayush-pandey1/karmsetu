"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoCircledIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";
import axios from 'axios'


const ManagePortfolio = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  // const [projects, setProjects] = useState([
  //   {
  //     id: 1,
  //     title: "Website Redesign",
  //     description:
  //       "Redesign the company website with a modern and responsive layout.",
  //     tags: ["web design", "responsive", "ux"],
  //     imageLink: "/images/portfolio/portfolio1.jpg",
  //   },
  //   {
  //     id: 2,
  //     title: "Mobile App Development",
  //     description: "Build a cross-platform mobile app for iOS and Android.",
  //     tags: ["mobile", "app development", "react native"],
  //     imageLink: "/images/portfolio/portfolio2.jpg",
  //   },
  //   {
  //     id: 3,
  //     title: "E-commerce Platform",
  //     description:
  //       "Develop a scalable e-commerce platform with advanced features.",
  //     tags: ["e-commerce", "backend", "frontend"],
  //     imageLink: "/images/portfolio/portfolio3.jpg",
  //   },
  // ]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: [],
    imageLink: null,
  });

  //To get freelancerId from sessionStorage
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('karmsetu'));
    console.log(data);
    setFreelancerId(data?.id);
    fetchUserData(data?.id);
  }, [])

  //To fetch freelancer details
  const fetchUserData = async (id) => {
    try {
      // console.log("Freelancer Id", id);
      const response = await axios.get(`/api/user/${id}`);
      // console.log("Freelancer Details", response.data);
      if (response.status === 200) {
        setProjects(response.data.user?.portfolioDetails || [])
        return response.data.user;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response ? error.response.data.message : error.message);
      return null;
    }
  };

  const handleProjectChange = (field, value) => {
    setNewProject((prevProject) => ({
      ...prevProject,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
      const reader = new FileReader();
      if (!(e.target.files[0])) {
        console.log("Please select a image first");
        return
      }


      reader.readAsDataURL(selectedFile);
      reader.addEventListener("load", () => {
        setPreviewImage(selectedFile);
      });
      reader.onloadend = async () => {
        const imageData = reader.result;
        try {
          console.log(imageData, "Image Data");
          const response = await fetch("/api/imageUpload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageData }),
          });
          console.log(response, "API response");
          const data = await response.json();
          if (data.success) {
            console.log("Images: ", data.url);
            setImage(data.url); // Set the image URL for submission
            setNewProject((prevProject) => ({
              ...prevProject,
              imageLink: data.url,
            }));
            console.log("Image uploaded successfully!", data.url);
          } else {
            console.error("Image upload failed.", data);
          }
        } catch (error) {
          console.error("Error uploading image:", error.message);
        }
      }

    }

  };

  const handleProjectSubmit = async () => {
    try {
      console.log(newProject, "newProject details from portfolio form");
      const response = await axios.put("/api/portfolioProject", { newProject, freelancerId })
      console.log(response);
      setProjects((prevProjects) => [
        ...prevProjects,
        {
          id: prevProjects.length + 1,
          ...newProject,
        },
      ]);
      setSelectedFile(null);
      setPreviewImage("");
      setNewProject({
        title: "",
        description: "",
        tags: [],
        imageLink: previewImage,
      });
      setImage("");
    } catch (error) {
      console.log("Error in creating the portfolio project", error.message);
    }
  };
  const handleProjectEdit = (projectId) => { };
  const handleProjectDelete = (projectId) => { };
  return (
    <div>
      <main className="flex flex-col sm:p-6 bg-gray-50">

        <Card className="rounded-none sm:rounded-xl">
          <CardHeader>
            <CardTitle className="leading-none text-gray-400 font-medium flex flex-row items-center gap-1"><BsInfoCircle className=" cursor-pointer" /> new project</CardTitle>
            <span className=" leading-none text-xl font-semibold">Add projects to showcase it on your portfolio</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    required
                    id="title"
                    value={newProject.title}
                    onChange={(e) =>
                      handleProjectChange("title", e.target.value)
                    }
                    className="border border-gray-200 rounded-md px-3 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    required
                    id="description"
                    value={newProject.description}
                    onChange={(e) =>
                      handleProjectChange("description", e.target.value)
                    }
                    className="border border-gray-200 rounded-md px-3 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Project Tags</Label>
                  <Input
                    id="tags"
                    required
                    value={newProject.tags.join(", ")}
                    onChange={(e) =>
                      handleProjectChange(
                        "tags",
                        e.target.value.split(",").map((tag) => tag.trim())
                      )
                    }
                    className="border border-gray-200 rounded-md px-3 focus:border-primary"
                  />
                  <span className="text-xs text-gray-400">Enter comma (,) seprated project tags</span>
                </div>
                <div>
                  <Label htmlFor="imageLink">Project Image</Label>
                  <div className="flex flex-col ">
                    <Input
                      id="imageLink"
                      type="file"
                      accept="imageLink/*"
                      onChange={handleImageUpload}
                      className="border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-3"
                      required
                    />
                    <Button
                      variant="default"
                      className="bg-purple-600 text-white "
                      onClick={handleProjectSubmit}
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-[3/2] bg-gray-100 rounded-md overflow-hidden flex justify-center items-center">
                  {newProject.imageLink ? (
                    <img
                      src={image}
                      alt="Project Image"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      style={{ aspectRatio: "300/200", objectFit: "cover" }}
                    />
                  ) : (
                    <div>Upload Project Image</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        <Card className="mt-6 rounded-none sm:rounded-xl">
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.length > 0 ? projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-md shadow-md overflow-hidden"
                >
                  <div className="aspect-[3/2] bg-gray-100">
                    <img
                      src={project.imageLink}
                      alt={project.title}
                      width="300"
                      height="200"
                      className="object-cover w-full h-full"
                      style={{ aspectRatio: "300/200", objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-600 px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-end mt-4 gap-2">
                      <Button
                        className="text-white "
                        size="icon"
                        onClick={() => handleProjectEdit(project.id)}
                      >
                        <FilePenIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        className=" text-white "
                        size="icon"
                        onClick={() => handleProjectDelete(project.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <div>No projects</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManagePortfolio;

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}
