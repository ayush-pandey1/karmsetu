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

// Schema validation
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
});

const OnboardingClient = () => {
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split('/');
    const extractedRole = segments[segments.length - 1];
    setRole(extractedRole);
    console.log("Extracted role:", extractedRole);
  }, []);

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

  // Capture the form submission
  const onSubmit = async (values) => {
    try {
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
        // if (userData?.role === "client") {
        router.push("/auth/redirect");


      } else {
        console.error("Failed to update user:", result.message);
      }

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="flex justify-center w-full h-full pt-0 md:pt-20 pb-10 font-inter">
      <div className="flex flex-col h-full w-[40rem] border border-stroke py-4">
        <div className="flex flex-col justify-center items-center mb-4">
          <p className="text-5xl text-black dark:text-white font-semibold">
            Client Details
          </p>
          <p className="text-sm">Fill your details to create your profile</p>
        </div>
        <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
        <div className=" h-full flex flex-col px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black">Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black">Gender</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="outline-none">
                          <SelectValue
                            className="placeholder:text-black"
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
                    <FormLabel className="font-semibold text-black">Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
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
                    <FormLabel className="font-semibold text-black">Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
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
                    <FormLabel className="font-semibold text-black">Industry</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="outline-none">
                          <SelectValue
                            className="placeholder:text-black"
                            placeholder="Select your industry"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
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
                    <FormLabel className="font-semibold text-black">Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell everyone about yourself" {...field} />
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
                    <FormLabel className="font-semibold text-black">Social Media</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your social media URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  className="bg-primary hover:bg-primary active:bg-primaryho text-white"
                  type="submit"
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

export default OnboardingClient;
