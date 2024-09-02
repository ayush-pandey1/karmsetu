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
} from "../ui/form.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation.js";
import { LuClipboardList } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { BsBriefcase } from "react-icons/bs";
import { GiSkills } from "react-icons/gi";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";
import { projectCategories } from "./projectCategory.js";
import {
  webDevelopmentSkills,
  videoProductionSkills,
  softwareDevelopmentSkills,
  contentWritingSkills,
  consultingStrategySkills,
  graphicDesignSkills,
  appDevelopmentSkills,
  socialMediaMarketingSkills,
} from "./skills.js";
import { Checkbox } from "../ui/checkbox.jsx";

const createJobSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title should be at least 5 characters long" }),
  description: z
    .string()
    .min(20, { message: "Description should be at least 20 characters long" }),
  projectCategory: z.string().min(1, { message: "Catagory is required" }),
  skills: z
  .array(z.string())
  .min(1, { message: "You have to select at least one skill." }),
  budget: z
    .string({ message: "Budget  is required" })
    .transform((val) => parseInt(val)),
  duration: z.string().min(1, { message: "Duration is required" }),
  clientId: z.string(),
});

const CreateJobForm = () => {
  
  const [userData, setUserData] = useState();
  const [count, setCount] = useState(0);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  useEffect(() => {
    if (!userData) {
      const data = JSON.parse(sessionStorage.getItem("karmsetu"));
      setUserData(data);
      if (data?.id) {
        form.reset({
          ...form.getValues(),
          clientId: data.id,
        });
      }
    }
  }, [userData]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
            console.log("Latitude:", latitude, "Longitude:", longitude);
          },
          (error) => {
            console.error("Error getting geolocation: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, [count]);
  // if (!coordinates.latitude) {
  //   setCount(count + 1);
  // }
  const form = useForm({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      projectCategory: "",
      skills: [],
      budget: "",
      duration: "",
      clientId: userData?.id,
    },
  });
  const { reset } = form;
  const router = useRouter();

  const onSubmitForm = async (values) => {
    console.log("Form Values:", values); // Check what values are being passed
    
    try {
      
      console.log("asas: ", coordinates);
      if (!coordinates.latitude || !coordinates.longitude) {
        console.error("Geolocation data is not available yet.");
        setCount(count + 1);
        return;
      }
      
      const clientName = userData?.name;
      const response = await axios.post("/api/projects/Project", {
        values,
        clientName,
        coordinates,
      });
      // console.log(values);
      setTags([]);
      console.log(response);
      reset();
      router.push("/cl/jobs");
    } catch (error) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const [selectedSkills, setSelectedSkills] = useState([]); //This is the project category selected, I (Ayush) made this to only determine which project category is selected

  useEffect(() => {
    switch (form.watch("projectCategory")) {
      case "web-development":
        setSelectedSkills(webDevelopmentSkills);
        break;
      case "app-development":
        setSelectedSkills(appDevelopmentSkills);
        console.log(selectedSkills);
        break;
      case "graphic-design":
        setSelectedSkills(graphicDesignSkills);
        break;
      case "consulting-strategy":
        setSelectedSkills(consultingStrategySkills);
        break;
      case "content-writing":
        setSelectedSkills(contentWritingSkills);
        break;
      case "software-development":
        setSelectedSkills(softwareDevelopmentSkills);
        break;
      case "video-production":
        setSelectedSkills(videoProductionSkills);
        break;
      case "social-media-marketing":
        setSelectedSkills(socialMediaMarketingSkills);
        break;
      default:
        setSelectedSkills([]);
        break;
    }
  }, [form.watch("projectCategory")]);

  return (
    <div className="flex flex-col ">
      <Form {...form}>
        <form
         onSubmit={form.handleSubmit(onSubmitForm)}
          className="space-y-8 mb-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold flex flex-row items-center gap-1">
                  <span>
                    <LuClipboardList className="text-primary" />
                  </span>
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
                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold flex flex-row items-center gap-1">
                  <span>
                    <TbListDetails className="text-primary" />
                  </span>
                  Project Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain about your project in detail."
                    className="resize-none border-b-slate-300 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectCategory"
            render={({ field }) => (
              <FormItem >
                <FormLabel className="text-black font-bold flex flex-row items-center gap-1">
                  <span>
                    <BsBriefcase className="text-primary" />
                  </span>
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold flex flex-row items-center gap-1">
                  <span>
                    <MdOutlineCurrencyRupee className="text-primary font-bold" />
                  </span>
                  Budget
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the project's budget"
                    type="number"
                    className="border-b-slate-300 w-50 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold flex flex-row items-center gap-1">
                  <span>
                    <GiSandsOfTime className="text-primary" />
                  </span>
                  Job Duration/Deadline
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the project title"
                    className="border-b-slate-300 placeholder:font- text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="flex  relative overflow-hidden animate-in slide-in-from-right-15 ease-in-out" />
              </FormItem>
            )}
          />

          <Button
          
            type="submit"
            className="bg-primary hover:bg-primary active:bg-primaryho  text-white">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateJobForm;
