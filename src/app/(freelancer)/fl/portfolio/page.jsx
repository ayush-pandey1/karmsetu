"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoCircledIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

const ManagePortfolio = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Website Redesign",
      description:
        "Redesign the company website with a modern and responsive layout.",
      tags: ["web design", "responsive", "ux"],
      image: "/images/portfolio/portfolio1.jpg",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Build a cross-platform mobile app for iOS and Android.",
      tags: ["mobile", "app development", "react native"],
      image: "/images/portfolio/portfolio2.jpg",
    },
    {
      id: 3,
      title: "E-commerce Platform",
      description:
        "Develop a scalable e-commerce platform with advanced features.",
      tags: ["e-commerce", "backend", "frontend"],
      image: "/images/portfolio/portfolio3.jpg",
    },
  ]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: [],
    image: null,
  });
  const handleProjectChange = (field, value) => {
    setNewProject((prevProject) => ({
      ...prevProject,
      [field]: value,
    }));
  };
  const handleImageUpload = (e) => {
    setNewProject((prevProject) => ({
      ...prevProject,
      image: e.target.files[0],
    }));
    const file = e.target.files[0];
    const fileReader = new FileReader();
    
    fileReader.addEventListener("load", () => {
        setPreviewImage(fileReader.result);
        
        
    });
   
    // setPortfolioImage(file.name)
    // console.log(portfolioImage)
    fileReader.readAsDataURL(file);
        
  };
  const handleProjectSubmit = () => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        id: prevProjects.length + 1,
        ...newProject,
      },
    ]);
    setNewProject({
      title: "",
      description: "",
      tags: [],
      image: previewImage,
    });
  };
  const handleProjectEdit = (projectId) => {};
  const handleProjectDelete = (projectId) => {};
  return (
    <div>
      <main className="flex flex-col sm:p-6 bg-gray-50">
        
        <Card className="rounded-none sm:rounded-xl">
          <CardHeader>
            <CardTitle className="leading-none text-gray-400 font-medium flex flex-row items-center gap-1"><BsInfoCircle className=" cursor-pointer"/> new project</CardTitle>
            <span className=" leading-none text-xl font-semibold">Add projects to showcase it on your portfolio</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
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
                  <Label htmlFor="image">Project Image</Label>
                  <div className="flex flex-col ">
                    
                  

                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-3"
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
                  {newProject.image ? (
                    <img
                      src={previewImage}
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
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-md shadow-md overflow-hidden"
                >
                  <div className="aspect-[3/2] bg-gray-100">
                    <img
                      src={project.image}
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
              ))}
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
