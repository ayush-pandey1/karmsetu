"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FaCamera,
  FaLink,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaBiohazard,
  FaFileUpload,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { MdAdd, MdDeleteForever, MdOutlineEdit, MdWork } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  webDeveloperSkills,
  androidIosDeveloperSkills,
  graphicDesignerSkills,
  consultantSkills,
  contentWriterSkills,
  softwareEngineerSkills,
  videographerSkills,
  legalAdvisorSkills,
  copywriterSkills,
  socialMediaManagerSkills,
} from "./skills";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { GiProgression } from "react-icons/gi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TagInput } from "emblor";

// Define the schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number should be ten digits" })
    .transform((val) => parseInt(val, 10)),
  age: z
    .string({ required_error: "Please enter your age" })
    .transform((val) => parseInt(val, 10)),
  gender: z.enum(["male", "female"], { message: "Please select a gender" }),
  address: z.string(),
  professionalTitle: z.string(),
  skills: z
    .array(z.string())
    .min(1, { message: "You have to select at least one skill." }),
  portfolioLink: z.string(),
  bio: z.string().min(10, { message: "Bio should be at least 10 words" }),
  socialMedia: z.string(),
  role: z.string(),
});

const OnboardingFreelancer = () => {
  const [selectedSkills, setSelectedSkills] = useState([]); //This is the profesional title selected, I (Ayush) made this to only determine which profesional title is selected
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState(null);
  const [userData, setUserData] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState(""); // State to store uploaded image URL
  const [selectedFile, setSelectedFile] = useState(null);


  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const extractedRole = segments[segments.length - 1];
    setRole(extractedRole);
    console.log("Extracted role:", extractedRole);
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
      const path = window.location.pathname;
      const segments = path.split("/");
      const extractedRole = segments[segments.length - 1];
      const sessionData = {
        email: session.user.email,
        name: session.user.name,
        id: session.user.id,
        role: extractedRole,
      };
      setRole(sessionData?.role);
      console.log("sdsd", role);
      sessionStorage.setItem("karmsetu", JSON.stringify(sessionData));
      console.log("Session data stored in sessionStorage:", sessionData);
      const data = JSON.parse(sessionStorage.getItem("karmsetu"));
      setRole(data?.role);
      setUserData(data);
    } else {
      const data = JSON.parse(sessionStorage.getItem("karmsetu"));
      setUserData(data);
      console.log("asas", data);
      setUserEmail(data?.email);
      setRole(data?.role);
    }
  }, [session, role]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      address: "",
      portfolioLink: "",
      bio: "",
      socialMedia: "",
      phoneNumber: "",
      age: "",
      gender: "",
      professionalTitle: "",
      skills: [],
      role: role,
      photo: "",
    },
  });

  useEffect(() => {
    if (role) {
      form.setValue("role", role);
    }
  }, [role]);

  useEffect(() => {
    if (userEmail) {
      form.setValue("email", userEmail);
    }
  }, [userEmail, form]);

  // Handle file change for image upload
  const handleFileChange = (e) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
      handleImageUpload();
    }
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async () => {
    if (!selectedFile) {
      console.log("Please select an image first.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = async () => {
      const imageData = reader.result;

      try {
        const response = await fetch("/api/imageUpload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });

        const data = await response.json();
        if (data.success) {
          setProfileImageUrl(data.url); // Set the image URL for submission
          form.setValue("photo", data.url); // Set the photo field value in the form
          console.log("Image uploaded successfully!", data.url);
        } else {
          console.error("Image upload failed.");
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    };
  };

  const onSubmit = async (data) => {
    console.log(data);
    console.log("role: ", role);
    try {
      const response = await fetch("/api/FpersonalDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("User updated successfully");

        router.push("/auth/redirect");
      } else {
        console.log(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      console.log("Something went wrong");
    }
  };

  useEffect(() => {
    switch (form.watch("professionalTitle")) {
      case "Web Developer":
        setSelectedSkills(webDeveloperSkills);
        break;
      case "Android/Ios Developer":
        setSelectedSkills(androidIosDeveloperSkills);
        break;
      case "Graphic Designer":
        setSelectedSkills(graphicDesignerSkills);
        break;
      case "Consultant":
        setSelectedSkills(consultantSkills);
        break;
      case "Content Writer":
        setSelectedSkills(contentWriterSkills);
        break;
      case "Software Engineer":
        setSelectedSkills(softwareEngineerSkills);
        break;
      case "Videographer":
        setSelectedSkills(videographerSkills);
        break;
      case "Legal Advisor":
        setSelectedSkills(legalAdvisorSkills);
        break;
      case "Copywriter":
        setSelectedSkills(copywriterSkills);
        break;
      case "Social Media Manager":
        setSelectedSkills(socialMediaManagerSkills);
        break;
      default:
        setSelectedSkills([]);
        break;
    }
  }, [form.watch("professionalTitle")]);

  // MileStone Feature
  const [tags, setTags] = useState([]);
  const [activeTagIndex, setActiveTagIndex] = useState(null);

  const [potfolioProjects, setPotfolioProjects] = useState([
    {
      title: "This is sample title for testing",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae ea delectus placeat quidem modi atque odio itaque, velit, harum sunt optio natus iusto aspernatur qui quos! Ipsum laudantium quaerat dolor.",
      amount: "343243",
      image: "/images/portfolio/portfolio1.jpg",
    },

    {
      title: "This is sample title for testing",
      description:
        " Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae ea delectus placeat quidem modi atque odio itaque, velit, harum sunt optio natus iusto aspernatur qui quos! Ipsum laudantium quaerat dolor.",
      amount: "343243",
      image: "/images/portfolio/portfolio3.jpg",
    },
    {
      title: "This is sample title for testing",
      description:
        " Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae ea delectus placeat quidem modi atque odio itaque, velit, harum sunt optio natus iusto aspernatur qui quos! Ipsum laudantium quaerat dolor.",
      amount: "343243",
      image: "/images/portfolio/portfolio2.jpg",
    },
  ]);
  // const [totalPercentage, setTotalPercentage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPortfolioProject, setSelectedPortfolioProject] = useState(null);
  // const [portfolioImage, setPortfolioImage] = useState(null)
  // const [portfolioImageURL, setPortfolioImageURL] = useState("")
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    description: "",
    amount: "",
  });

  // portfolio Image upload
  const [previewImage, setPreviewImage] = useState(null);
  const [portfolioImage, setPortfolioImage] = useState(null);
    const handleSelectImage = (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        
        fileReader.addEventListener("load", () => {
            setPreviewImage(fileReader.result);
            
            
        });
       
        setPortfolioImage(file.name)
        console.log(portfolioImage)
        fileReader.readAsDataURL(file);
        
        
        
    }

  const handleAddMilestone = () => {


    setPotfolioProjects([...potfolioProjects, ]);
    
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (milestone = null, index = null) => {
    if (milestone) {
      setPortfolioData(milestone);
      setSelectedPortfolioProject(index);
    } else {
      setPortfolioData({ title: "", description: "", amount: "" });
      setSelectedPortfolioProject(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPortfolioData({ title: "", description: "", amount: "" });
  };

  const handleChangeMilestone = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (selectedPortfolioProject !== null) {
      const updatedPortfolioData = potfolioProjects.map((milestone, index) =>
        index === selectedPortfolioProject ? portfolioData : milestone
      );
      setPotfolioProjects(updatedPortfolioData);
    } else {
      setPotfolioProjects([...potfolioProjects, portfolioData]);
    }
    handleCloseDialog();
  };

  const handleRemove = (index) => {
    setPotfolioProjects(potfolioProjects.filter((_, i) => i !== index));
  };
  return (
    <div className="flex justify-center w-full h-full pt-0  font-inter">
      <div className="flex flex-col h-full w-[40rem] border border-gray-300 pb-4 sm:py-4 bg-white dark:bg-gray-800  ">
        <div className=" w-full  p-2 flex justify-center ">
          <Image
            src="/images/karmsetuLogo-cropped.svg"
            width="0"
            height="0"
            className="w-[10rem] h-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-4xl text-black dark:text-white font-semibold">
            Profile Details
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Fill your details to create your profile
          </p>
        </div>
        {/* <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" /> */}
        <div className="px-10 mb-5">
          <Separator />
        </div>
        <div className="h-full flex flex-col px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center mb-4">
                <label
                  htmlFor="photoUpload"
                  className="flex items-center justify-center w-24 h-24 border border-dashed border-gray-400 rounded-full cursor-pointer relative"
                >
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaCamera className="text-gray-600 dark:text-gray-300 text-3xl" />
                  )}
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer border border-primary"
                  />
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload your photo
                </p>
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaPhone className="text-primary mr-2" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your number"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaUser className="text-primary mr-2" />
                      Age
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your age"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaBiohazard className="text-primary mr-2" />
                      Gender
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="outline-none">
                          <SelectValue
                            className="placeholder:text-black dark:placeholder:text-white"
                            placeholder="Select your gender"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaMapMarkerAlt className="text-primary mr-2" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professionalTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <MdWork className="text-primary mr-2" />
                      Professional Title
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select your role"
                            className="placeholder:text-black dark:placeholder:text-white"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="overflow-hidden">
                        <SelectItem value="Web Developer">
                          Web Developer
                        </SelectItem>
                        <SelectItem value="Android/Ios Developer">
                          Android/Ios Developer
                        </SelectItem>
                        <SelectItem value="Graphic Designer">
                          Graphic Designer
                        </SelectItem>
                        <SelectItem value="Consultant">Consultant</SelectItem>
                        <SelectItem value="Content Writer">
                          Content Writer
                        </SelectItem>
                        <SelectItem value="Software Engineer">
                          Software Engineer
                        </SelectItem>
                        <SelectItem value="Videographer">
                          Videographer
                        </SelectItem>
                        <SelectItem value="Legal Advisor">
                          Legal Advisor
                        </SelectItem>
                        <SelectItem value="Copywriter">Copywriter</SelectItem>
                        <SelectItem value="Social Media Manager">
                          Social Media Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="font-semibold text-black dark:text-white">
                          Skills
                        </FormLabel>
                        <FormDescription>
                          Select the skills you want to add to your profile.
                        </FormDescription>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {selectedSkills.map((skill) => (
                          <FormItem
                            key={skill.id}
                            className="flex flex-row items-center space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(skill.id)}
                                onCheckedChange={(checked) => {
                                  const newSkills = checked
                                    ? [...field.value, skill.id]
                                    : field.value.filter((s) => s !== skill.id);
                                  field.onChange(newSkills);
                                  console.log(newSkills);
                                }}
                                className="rounded-sm "
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal dark:text-gray-300">
                              {skill.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="font-inter">
                <div className="">
                  <FormLabel className="text-black font-bold flex flex-row items-center gap-1 mb-5">
                    <FaLink className="text-primary mr-1" />
                    Portfolio
                  </FormLabel>
                  <div className="flex flex-col gap-2  ">
                    {potfolioProjects.map((portfolio, index) => (
                      <div
                        key={index}
                        className="milestone-card flex flex-col border border-gray-300 shadow-sm  rounded-md p-4 "
                      >
                        <div className="flex flex-col   gap-2 mb-3">
                          <div className="flex flex-col   gap-1 mb-3">
                            <span className="leading-none text-sm">
                              <span className="text-black font-bold text-lg sm:text-2xl font-inter leading-none">
                                {portfolio.title}
                              </span>{" "}
                            </span>
                            <span className="leading-[16px]  text-sm sm:text-md font-inter">
                              <span
                                className="font-inter font-medium "
                                style={{ fontWeight: 500 }}
                              >
                                {" "}
                                {portfolio.description}
                              </span>
                            </span>
                          </div>

                          <span className="w-full h-45 ">
                            <Image
                              src={portfolio.image}
                              alt="portfolio image"
                              height="0"
                              width="0"
                              className="w-full h-full object-cover rounded-lg shadow-none"
                              unoptimized
                            />
                          </span>

                          <div className=" w-full flex flex-row flex-wrap gap-2 items-center mt-3">
                            <span className="text-white bg-green-600 bg-opacity- px-2 py-1 rounded-sm font-medium text-sm">
                              Next.js
                            </span>
                            <span className="text-white bg-green-600 bg-opacity- px-2 py-1 rounded-sm font-medium text-sm">
                              Next.js
                            </span>
                            <span className="text-white bg-green-600 bg-opacity- px-2 py-1 rounded-sm font-medium text-sm">
                              Next.js
                            </span>
                            <span className="text-white bg-green-600 bg-opacity- px-2 py-1 rounded-sm font-medium text-sm">
                              Next.js
                            </span>
                            <span className="text-white bg-green-600 bg-opacity- px-2 py-1 rounded-sm font-medium text-sm">
                              Next.js
                            </span>
                            <span className="text-white bg-green-600 bg-opacity- px-2 py-1 rounded-sm font-medium text-sm">
                              Next.js
                            </span>
                          </div>
                        </div>
                        <div className="actions mb-2 flex flex-row items-center">
                          <Button
                            onClick={() => handleOpenDialog(milestone, index)}
                            className="button bg-transparent hover:bg-transparent focus:bg-transparent shadow-none text-blue-500 flex flex-row items-center gap-1 pl-0"
                          >
                            Edit
                            <MdOutlineEdit />
                          </Button>
                          <Button
                            onClick={() => handleRemove(index)}
                            className="button bg-transparent hover:bg-transparent focus:bg-transparent shadow-none text-red-500 flex flex-row items-center  gap-1"
                          >
                            Remove
                            <MdDeleteForever />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="button px-2 py-0 mt-0 text-primary bg-transparent hover:bg-transparent hover:text-primaryho shadow-none flex flex-row gap- items-center text-sm"
                >
                  Add Milestone
                  <MdAdd />
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                  <DialogContent className="gap-2">
                    <DialogTitle className="text-black">
                      {selectedPortfolioProject !== null
                        ? "Edit Project"
                        : "Add Project"}
                    </DialogTitle>
                    <DialogDescription>
                      Add a milestone with amount.
                    </DialogDescription>
                    <div className="flex flex-col space-y-4">
                      <Input
                        type="text"
                        name="title"
                        value={portfolioData.title}
                        onChange={handleChangeMilestone}
                        placeholder="Title"
                        className="input "
                      />
                      <Textarea
                        name="description"
                        value={portfolioData.description}
                        onChange={handleChangeMilestone}
                        placeholder="Description"
                        className="textarea"
                      />
                      <TagInput
                        placeholder="Enter a required skills"
                        className="border-none"
                        styleClasses={{
                          input:
                            "w-full text-black border-none shadow-none placeholder:font-medium   sm:max-w-full",
                        }}
                        tags={tags}
                        setTags={(newTags) => {
                          setTags(newTags);
                          //   skillsRequired.push(newTags);
                          // form.setValue(newTags)
                          //   setValue("topics");
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                        animation={"slideIn"}
                      />

                      <div className="flex flex-col items-center mb-4">
                        <label
                          htmlFor="photoUpload"
                          className="flex items-center justify-center w-full h-44 rounded-lg border border-dashed border-gray-400  cursor-pointer relative"
                        >
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-lg "
                            />
                          ) : (
                            <FaFileUpload className="text-gray-600 dark:text-gray-300 text-3xl" />
                          )}
                          <input
                            id="photoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleSelectImage}
                            className="absolute inset-0 opacity-0 cursor-pointer border border-primary"
                          />
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Upload project image
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        className="button bg-transparent hover:bg-transparent focus:bg-transparent text-red-500 shadow-none"
                        onClick={handleCloseDialog}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="button bg-green-500 hover:bg-green-700 focus:bg-green-500 px-4"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <FormField
                control={form.control}
                name="portfolioLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaLink className="text-primary mr-2" />
                      Portfolio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your portfolio URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaUser className="text-primary mr-2" />
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell everyone about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialMedia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black dark:text-white flex items-center">
                      <FaLink className="text-primary mr-2" />
                      Social Media
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your social media URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primaryho focus:primary font-semibold text-lg rounded-lg py-3 px-6 mt-4"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFreelancer;
