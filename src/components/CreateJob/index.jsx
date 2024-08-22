"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { TagInput } from "emblor";
import { projectCategories } from "./projectCategory.js";
import { useState } from "react";

const createJobSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title should be at least 5 characters long" }),
  description: z
    .string()
    .min(20, { message: "Description should be at least 20 characters long" }),
  projectCategory: z.string().min(1, { message: "Catagory is required" }),
  budget: z.string({ message: "Budget  is required" }).transform((val) => parseInt(val)),
  duration: z.string().min(1, { message: "Duration is required" }),
});

const CreateJobForm = () => {
  const [tags, setTags] = useState([]);
  const [activeTagIndex, setActiveTagIndex] = useState(null);

  const form = useForm({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      projectCategory: "",
      budget: "",
      duration: "",
    },
  });

  const onSubmitForm = (values) => {
    console.log("Form submitted with values:", values);
    // alert("Form submitted successfully!");
    console.log(tags);
  };

  return (
    <div className="flex flex-col ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">
                  Job Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the project title"
                    className="border-b-slate-300 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-black ">
                  Project Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain about your project in detail."
                    className="resize-none border-b-slate-300 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-black">
                  Project Category
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="placeholder:text-black"
                        placeholder="Select your category of project."
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="overflow-hidden">
                    {projectCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skillsRequired"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">
                  Required Skillset
                </FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Enter a required skills"
                    className="border-none"
                    styleClasses={{
                      input:
                        "w-full text-black border-none shadow-none placeholder:font-medium   sm:max-w-full]",
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
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">Budget</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the project's budget"
                    type="number"
                    className="border-b-slate-300 w-50 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">
                  Job Duration/Deadline
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the project title"
                    className="border-b-slate-300 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out"/>
              </FormItem>
            )}
          />

          <Button
            className="bg-primary hover:bg-primary active:bg-primaryho  text-white"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateJobForm;
