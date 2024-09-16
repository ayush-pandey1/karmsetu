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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../ui/dialog.jsx";


import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation.js";
import { LuClipboardList } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { BsBriefcase } from "react-icons/bs";
import { GiSkills, GiProgression } from "react-icons/gi";
import { MdAdd, MdDeleteForever, MdOutlineEdit } from "react-icons/md";
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
import { Label } from "../ui/label.jsx";
import { fetchClientProjects } from "@/app/(redux)/features/projectDataSlice.js"
import { checkout } from "@/checkout.js";
import Script from "next/script";

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
  //const [formSubmitted, setFormSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });


  // MileStone Feature
  const [milestones, setMilestones] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [clientImageLink, setClientImageLink] = useState("");
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    description: "",
    amount: 0,
  });
  useEffect(() => {
    // console.log("milestone: ", milestones);
    // console.log("MilestoneData: ", milestoneData);
    let totalAmount = 0;
    milestones && milestones.forEach(item => {
      totalAmount += parseFloat(item.amount);
    });
    setTotalPercentage(totalAmount);
    // console.log(
    //   "work; ", totalAmount
    // )
    if ((totalAmount > 100 || totalAmount < 100) || milestones.length == 0) {
      setError(true);
    }
    else {
      setError(false);
    }
  }, [milestones, milestoneData])

  useEffect(() => {
    if (!userData) {
      const data = JSON.parse(sessionStorage.getItem("karmsetu"));
      setUserData(data);
      if (data?.id) {
        setClientImageLink(data?.imageLink);
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
  // console.log("Errors:", form.formState.errors);
  const { reset } = form;
  const router = useRouter();

  // useEffect(() => {
  //   if(formSubmitted){
  //     if (userData?.id) {
  //       dispatch(fetchProjects(userData?.id));
  //     }
  //   }
  // }, [userData?.id, dispatch, formSubmitted]);



  const amount = 100;
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const handlePayment = (values) => {
    const { title, budget, description } = values;
    const name = userData?.name;
    const phone = userData?.phone;
    const email = userData?.email;
    console.log("Title: ", title, "budget: ", budget, "user name: ", name, "phone: ", phone, "email: ", email);
    return new Promise((resolve, reject) => {
      if (!sdkReady) {
        console.error("Razorpay SDK is not loaded yet.");
        resolve(false);
        return;
      }

      setIsProcessing(true);

      fetch("/api/create-payment", { method: "POST" })
        .then(response => response.json())
        .then(data => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: budget * 100,
            currency: "INR",
            name: title,
            description: description,
            order_id: data.order_id,
            handler: function (res) {
              console.log("Payment successful", res);
              resolve(true);
            },
            prefill: {
              name: name,
              email: email,
              contact: phone,
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();

          rzp1.on("payment.failed", function (response) {
            console.error("Payment failed", response);
            resolve(false);
          });

        })
        .catch(error => {
          console.error("Failed to fetch payment data", error);
          resolve(false);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    });
  };


  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setSdkReady(true);
    } else {
      console.error("Razorpay SDK failed to load");
    }
  }, [sdkReady]);

  const onSubmitForm = async (values) => {
    if (error) {
      return;
    }
    console.log("Form Values:", values, milestones);
    // return;
    if (isProcessing) {
      console.warn("Payment already in progress.");
      return;
    }
    const paymentSuccessful = await handlePayment(values);
    if (!paymentSuccessful) {
      console.error("Payment failed or was not completed.");
      return;
    }
    try {
      console.log("asas: ", values);
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
        milestones,
        // clientImageLink
      });
      // console.log(values);
      // setTags([]);
      console.log(response.data.savedProject._id, "Response");
      // return;
      // dispatch(fetchClientProjects(userData?.id))
      router.push("/cl/jobs");
      // if (response?.data?.savedProject?._id) {
      // stripe(response.data.savedProject._id);
      // const res = handlePayment();
      // console.log("Payment: ", res);
      // router.push("/cl/jobs");
      // }
      // else {
      // router.push("/cl/jobs");
      // }
      // if (userData?.id) {
      //   dispatch(fetchClientProjects(userData?.id))
      //   router.push("/cl/jobs");
      // }
      // resetForm();
      // stripe(projectId);
      // router.push("/cl/jobs");
    } catch (error) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const [selectedSkills, setSelectedSkills] = useState([]); //This is the project category selected, I (Ayush) made this to only determine which project category is selected
  // ohk(suraj)
  const stripe = (projectId) => {
    checkout({ lineItems: [{ price: "price_1PwtGCBgUZPJOEsGdnpQouDx", quantity: 1 }], projectId })
    return;
  }

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



  const handleAddMilestone = () => {
    const { percentage } = newMilestone;

    if (totalPercentage + percentage > 100) {
      toast.error("Total milestone percentage cannot exceed 100%");
      return;
    }

    setMilestones([...milestones, newMilestone]);
    setTotalPercentage(totalPercentage + percentage);
    setNewMilestone({ description: "", percentage: 0 });
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (milestone = null, index = null) => {
    if (milestone) {
      setMilestoneData(milestone);
      setSelectedMilestone(index);
    } else {
      setMilestoneData({ title: "", description: "", amount: "" });
      setSelectedMilestone(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setMilestoneData({ title: "", description: "", amount: "" });
  };

  const handleChangeMilestone = (e) => {
    const { name, value } = e.target;
    setMilestoneData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (selectedMilestone !== null) {
      const updatedMilestones = milestones.map((milestone, index) =>
        index === selectedMilestone ? milestoneData : milestone
      );
      setMilestones(updatedMilestones);
    } else {
      setMilestones([...milestones, milestoneData]);
    }
    handleCloseDialog();
  };

  const handleRemove = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

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
              <FormItem>
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
                    {projectCategories &&
                      projectCategories.map((category) => (
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
                    <FormDescription className="">
                      First select the{" "}
                      <span className="text-blue-500 font-medium">
                        project category,{" "}
                      </span>
                      then skills.
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

          <div>
            <div className="">
              <FormLabel className="text-black font-bold flex flex-row items-center gap-1 mb-5">
                <GiProgression className="text-primary" />
                Project Milestones
              </FormLabel>
              {milestones.map((milestone, index) => (
                <div key={index} className="milestone-card flex flex-col ">
                  <div className="flex flex-col border-l-[3px] border-l-green-500 px-2 gap-2 mb-3">
                    <span className="leading-none text-sm">
                      <span className="text-black font-semibold text-md">
                        Title:
                      </span>{" "}
                      {milestone.title}
                    </span>
                    <span className="leading-[16px] text-sm">
                      <span className="text-black font-semibold text-md">
                        Description:
                      </span>{" "}
                      {milestone.description}
                    </span>
                    <span className="leading-none text-green-500 text-sm">
                      <span className="text-black font-semibold text-md">
                        Amount:{" "}
                      </span>
                      {milestone.amount}%
                    </span>
                  </div>
                  <div className="actions mb-2 flex flex-row items-center">
                    <Button
                      onClick={() => handleOpenDialog(milestone, index)}
                      className="button bg-transparent hover:bg-transparent focus:bg-transparent shadow-none text-blue-500 flex flex-row items-center gap-1"
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
                  {selectedMilestone !== null
                    ? "Edit Milestone"
                    : "Add Milestone"}
                </DialogTitle>
                <DialogDescription>
                  Add a milestone with amount.
                </DialogDescription>
                <div className="flex flex-col space-y-4">
                  <Input
                    type="text"
                    name="title"
                    value={milestoneData.title}
                    onChange={handleChangeMilestone}
                    placeholder="Title"
                    className="input "
                  />
                  <Textarea
                    name="description"
                    value={milestoneData.description}
                    onChange={handleChangeMilestone}
                    placeholder="Description"
                    className="textarea"
                  />
                  <Input
                    type="number"
                    name="amount"
                    value={milestoneData.amount}
                    onChange={handleChangeMilestone}
                    placeholder="Amount(In percentage)"
                    className="input"
                    min="1"
                    max="100"
                  />
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
              {error ? (milestones == 0 ? (
                <p style={{ color: "red", fontSize: "12px" }}>You must set at least one milestone for the project.</p>
              ) :
                totalPercentage > 100 ? (
                  <p style={{ color: "red", fontSize: "12px" }}>The total percentage exceeds 100%.</p>
                ) : totalPercentage < 100 ? (
                  <p style={{ color: "red", fontSize: "12px" }}>The total percentage is less than 100%.</p>
                ) : (
                  <></>
                )
              ) : null}
            </Dialog>
          </div>


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
            className="bg-primary hover:bg-primary active:bg-primaryho text-white"
          >
            Submit
          </Button>
        </form>
      </Form>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setSdkReady(true)} // Set SDK ready when script is loaded
        onError={() => console.error("Failed to load Razorpay SDK")}
        strategy="beforeInteractive" // Load before page interaction
      />
    </div>
  );
};

export default CreateJobForm;
