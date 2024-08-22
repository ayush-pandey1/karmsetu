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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { skills } from "./skills";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string().min(10, { message: "Phone number should be ten digits" })
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
  bio: z.string().min(10, { message: "Bio should be atleast 10 words" }),
  //   language: z.string(),
  socialMedia: z.string(),
  role: z.string(),
});

const OnboardingFreelancer = () => {
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

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
    }
  }, [session]);

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

  const onSubmit = async (data) => {
    console.log(data);
    console.log("sdasda", role);
    try {
      const response = await fetch("/api/FpersonalDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        console.log("User updated successfully");
        router.push("/");

      } else {
        console.log(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      console.log("Something went wrong");
    }
  };


  return (
    <div className="flex justify-center w-full h-full pt-0 md:pt-20 pb-10 font-inter">
      <div className="flex flex-col h-full w-[40rem] border border-stroke  py-4">
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-5xl text-black dark:text-white font-semibold">
            Freelancer Details
          </p>
          <p className="text-sm">
            Fill your details to create your profile
          </p>
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
                    <FormLabel className="font-semibold text-black ">
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
                    <FormLabel className="font-semibold text-black ">
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
                    <FormLabel className="font-semibold text-black ">
                      Gender
                    </FormLabel>
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
                    <FormLabel className="font-semibold text-black ">
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
                    <FormLabel className="font-semibold text-black ">
                      Professional title
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            className="placeholder:text-black"
                            placeholder="Select your professional title"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="overflow-hidden">
                        <SelectItem value="Web Developer">
                          Web Developer
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
                        <FormLabel className="font-semibold text-black ">
                          Skills
                        </FormLabel>
                        <FormDescription>
                          Select the skills you want to add to your profile.
                        </FormDescription>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {skills.map((skill) => (
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
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
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
                    <FormLabel className="font-semibold text-black ">
                      Portfolio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your portfolio url"
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
                    <FormLabel className="font-semibold text-black ">
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
                    <FormLabel className="font-semibold text-black ">
                      Social Media
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your social media url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center ">
                <Button
                  className="bg-primary hover:bg-primary active:bg-primaryho  text-white"
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

export default OnboardingFreelancer;
