"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoCircledIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";
import axios from 'axios';
import toast from "react-hot-toast";
import { portfolioProjectSchema } from "@/validations/portfolio";

const ManagePortfolio = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setPreviewImage(file);
      });
      reader.onloadend = async () => {
        const imageData = reader.result;
        setIsUploading(true);
        try {
          const response = await fetch("/api/imageUpload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageData }),
          });
          const data = await response.json();
          if (data.success) {
            setImage(data.url);
            setNewProject((prevProject) => ({
              ...prevProject,
              imageLink: data.url,
            }));
            toast.success("Project image uploaded successfully!");
          } else {
            console.error("Image upload failed.", data);
            toast.error("Failed to upload project image");
          }
        } catch (error) {
          console.error("Error uploading image:", error.message);
          toast.error("Error uploading image");
        } finally {
          setIsUploading(false);
        }
      };
    }
  };

  const handleProjectSubmit = async () => {
    if (!freelancerId) {
      toast.error("Freelancer ID missing. Please refresh.");
      return;
    }

    const validationResult = portfolioProjectSchema.safeParse(newProject);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Invalid project details";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedProject = validationResult.data;
      const response = await axios.put("/api/portfolioProject", { newProject: sanitizedProject, freelancerId });
      setProjects((prevProjects) => [
        ...prevProjects,
        {
          id: prevProjects.length + 1,
          ...sanitizedProject,
        },
      ]);
      setSelectedFile(null);
      setPreviewImage("");
      setNewProject({
        title: "",
        description: "",
        tags: [],
        imageLink: "",
      });
      setImage("");
      toast.success("Project added to portfolio successfully!");
    } catch (error) {
      console.log("Error in creating the portfolio project", error.message);
      toast.error(error.response?.data?.message || "Failed to add project to portfolio");
    } finally {
      setIsSubmitting(false);
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
                      accept="image/*"
                      disabled={isUploading || isSubmitting}
                      onChange={handleImageUpload}
                      className="border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                    <Button
                      variant="default"
                      disabled={isSubmitting || isUploading}
                      className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={handleProjectSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          Adding Project...
                        </>
                      ) : isUploading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          Uploading Image...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Add Project
                        </>
                      )}
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
