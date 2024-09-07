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
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { MdWork } from "react-icons/md";
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
      photo: ""
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
      console.log(e.target.files[0])
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
  return (
    <div className="flex justify-center w-full h-full pt-0 md:pt-20 pb-10 font-inter">
      <div className="flex flex-col h-full w-[40rem] border border-stroke py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-5xl text-black dark:text-white font-semibold">
            Freelancer Details
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Fill your details to create your profile
          </p>
        </div>
        <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
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
                    className="absolute inset-0 opacity-0 cursor-pointer"
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 font-bold text-lg rounded-lg py-3 px-6 mt-4"
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
