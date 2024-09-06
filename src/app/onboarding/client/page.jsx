"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaPhone,
  FaBirthdayCake,
  FaTransgender,
  FaBuilding,
  FaIndustry,
  FaPen,
  FaGlobe,
  FaUpload,
} from "react-icons/fa";

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
  companyName: z.string(),
  industry: z.string(),
  bio: z.string().min(10, { message: "Bio should be at least 10 words" }),
  socialMedia: z.string().url(),
  role: z.string(),
  photo: z.any().optional(), // New photo field
});

const OnboardingClient = () => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState(""); // State to store uploaded image URL
  const [selectedFile, setSelectedFile] = useState(null);

  // Set role from URL path
  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const extractedRole = segments[segments.length - 1];
    setRole(extractedRole);
  }, []);

  // Set user email from session or sessionStorage
  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
      const path = window.location.pathname;
      const segments = path.split('/');
      const extractedRole = segments[segments.length - 1];
      const sessionData = {
        email: session.user.email,
        name: session.user.name,
        id: session.user.id,
        role: extractedRole,
      };
      setRole(sessionData?.role);
      console.log("sdsd", role);
      sessionStorage.setItem('karmsetu', JSON.stringify(sessionData));
      console.log('Session data stored in sessionStorage:', sessionData);
      const data = JSON.parse(sessionStorage.getItem('karmsetu'));
      setRole(data?.role);
      setUserData(data);
    }
    else {
      const data = JSON.parse(sessionStorage.getItem('karmsetu'));
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
      companyName: "",
      bio: "",
      socialMedia: "",
      phoneNumber: "",
      age: "",
      gender: "",
      industry: "",
      role: role,
      photo: "", // New photo default value
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
      if(e.target.files){
      console.log(e.target.files[0])
      setSelectedFile(e.target.files[0]);
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


  const onSubmit = async (values) => {
    try {
      await handleImageUpload();
      const response = await fetch("/api/CpersonalDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("User updated successfully:", result);
        console.log("userdata", userData);
        router.push("/auth/redirect");
      } else {
        console.error("Failed to update user:", result.message);
      }

    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="flex justify-center w-full h-full pt-0 md:pt-20 pb-10 font-inter bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="flex flex-col h-full w-full md:w-[40rem] border border-gray-300 shadow-2xl rounded-3xl bg-white py-8 px-6">
        <div className="flex flex-col justify-center items-center mb-6">
          <p className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-bold">
            Client Details
          </p>
          <p className="text-sm text-gray-600">
            Fill in your details to create your profile
          </p>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="h-full flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              encType="multipart/form-data"
            >
              <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaUser className="mr-2 text-blue-600" /> Upload Photo
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-3"
                        >
                          <FaUpload className="mr-2" /> Choose File
                        </label>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden" // Hide the default file input
                        />
                        {profileImageUrl && (
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-blue-600">
                            <img
                              src={profileImageUrl}
                              className="w-full h-full object-cover"
                              alt="Profile" 
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaPhone className="mr-2 text-green-600" /> Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your number"
                        {...field}
                        className="border-green-600 focus:border-green-700 focus:ring-green-600"
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
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaBirthdayCake className="mr-2 text-pink-600" /> Age
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your age"
                        {...field}
                        className="border-pink-600 focus:border-pink-700 focus:ring-pink-600"
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
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaTransgender className="mr-2 text-purple-600" /> Gender
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      className="border-purple-600 focus:border-purple-700 focus:ring-purple-600"
                    >
                      <FormControl>
                        <SelectTrigger className="outline-none">
                          <SelectValue
                            className="placeholder:text-gray-900"
                            placeholder="Select your gender"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaBuilding className="mr-2 text-yellow-600" /> Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your address"
                        {...field}
                        className="border-yellow-600 focus:border-yellow-700 focus:ring-yellow-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaIndustry className="mr-2 text-orange-600" /> Company
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        {...field}
                        className="border-orange-600 focus:border-orange-700 focus:ring-orange-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaIndustry className="mr-2 text-teal-600" /> Industry
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      className="border-teal-600 focus:border-teal-700 focus:ring-teal-600"
                    >
                      <FormControl>
                        <SelectTrigger className="outline-none">
                          <SelectValue
                            className="placeholder:text-gray-900"
                            placeholder="Select your industry"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaPen className="mr-2 text-red-600" /> Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us something about yourself"
                        {...field}
                        className="border-red-600 focus:border-red-700 focus:ring-red-600"
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
                    <FormLabel className="font-semibold text-gray-800 flex items-center">
                      <FaGlobe className="mr-2 text-indigo-600" /> Social Media
                      Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your social media link"
                        {...field}
                        className="border-indigo-600 focus:border-indigo-700 focus:ring-indigo-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 font-bold text-lg rounded-lg py-3 px-6 mt-4"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingClient;
