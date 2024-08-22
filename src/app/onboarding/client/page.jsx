"use client";

import React from "react";
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

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number should be ten digits" })
    .transform((val) => parseInt(val, 10)), 
  age: z
    .string({ required_error: "Please enter your age" })
    .transform((val) => parseInt(val, 10)),
  gender: z.enum(["male", "female"], { message: "Please select a gender" }),
  address: z.string(),
  industry: z.string(),
  skills: z
    .array(z.string())
    .min(1, { message: "You have to select at least one skill." }),
  companyName: z.string(),
  bio: z.string().min(10, { message: "Bio should be atleast 10 words" }),
  //   language: z.string(),
  socialMedia: z.string(),
});

const OnboardingClient = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      companyName: "",
      bio: "",
      socialMedia: "",
      phoneNumber: "",
      age: "",
      gender: "",
      industry: "",
      skills: [],
    },
  });

  const onSubmit = (values) => {
    // Do something with the form values.

    console.log(values);
  };

  return (
    <div className="flex justify-center w-full h-full pt-0 md:pt-20 pb-10 font-inter">
      <div className="flex flex-col h-full w-[40rem] border border-stroke  py-4">
        <div className="flex flex-col justify-center items-center mb-4">
          <p className="text-5xl text-black dark:text-white font-semibold">
            Client Details
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
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
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
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
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
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black ">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company/org name"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-black ">
                      Industry
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            className="placeholder:text-black"
                            placeholder="Select your industry."
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="overflow-hidden">
                        <SelectItem value="Information Technology">
                        Information Technology (IT)
                        </SelectItem>
                        <SelectItem value="Marketing">
                        Marketing
                        </SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Design">
                        Design
                        </SelectItem>
                        <SelectItem value="Healthcare">
                          Healthcare
                        </SelectItem>
                        <SelectItem value="Legal">
                        Legal
                        </SelectItem>
                        <SelectItem value="Education">
                        Education
                        </SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Transportation & Logistics">
                        Transportation & Logistics
                        </SelectItem>
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
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
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
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
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

export default OnboardingClient;
