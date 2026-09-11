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
import { freelancerProfileSchema } from "@/validations/user";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

const OnboardingFreelancer = () => {
  const [selectedSkills, setSelectedSkills] = useState([]); //This is the profesional title selected, I (Ayush) made this to only determine which profesional title is selected
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState(null);
  const [userData, setUserData] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState(""); // State to store uploaded image URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


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
        imageLink: profileImageUrl
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
    resolver: zodResolver(freelancerProfileSchema),
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
      role: role || "freelancer",
      photo: profileImageUrl,
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();

      reader.readAsDataURL(file);

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
            setProfileImageUrl(data.url);
            form.setValue("photo", data.url);
            toast.success("Profile photo uploaded!");
          } else {
            console.error("Image upload failed.", data);
            toast.error("Failed to upload image. Please try again.");
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

  const fetchDataAI = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_AI_API}/fetch-data/`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          run_code: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.detail}`);
      }

      const data = await response.json();
      console.log("dataaa: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (profileImageUrl) {
      form.setValue("photo", profileImageUrl);
    }
  }, [profileImageUrl]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
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
        toast.success("Freelancer profile created successfully! Redirecting...");
        fetchDataAI().catch(err => console.error("AI recommendation error:", err));
        router.push("/auth/redirect");
      } else {
        toast.error(result.message || "Failed to create profile.");
      }
    } catch (error) {
      console.error("Error submitting form", error.message);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
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
                  className={`flex items-center justify-center w-24 h-24 border border-dashed border-gray-400 rounded-full cursor-pointer relative overflow-hidden ${
                    isUploading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : profileImageUrl ? (
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
                    disabled={isUploading || isSubmitting}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer border border-primary disabled:cursor-not-allowed"
                  />
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {isUploading ? "Uploading photo..." : "Upload your photo"}
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
                        placeholder="Enter your 10-digit phone number"
                        type="tel"
                        maxLength={15}
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
                        placeholder="Enter your age (e.g. 25)"
                        type="number"
                        min={16}
                        max={100}
                        step={1}
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
                  disabled={isSubmitting || isUploading}
                  className="bg-primary hover:bg-primaryho focus:primary font-semibold text-lg rounded-lg py-3 px-6 mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Creating Profile...
                    </>
                  ) : (
                    "Submit"
                  )}
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
