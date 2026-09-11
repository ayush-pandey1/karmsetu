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
import { Badge } from "../ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog.jsx";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation.js";
import { LuClipboardList, LuSparkles, LuCheck, LuX } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { BsBriefcase } from "react-icons/bs";
import { GiProgression, GiSandsOfTime } from "react-icons/gi";
import { MdAdd, MdDeleteForever, MdOutlineEdit, MdOutlineCurrencyRupee } from "react-icons/md";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
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
import toast from "react-hot-toast";

import { createJobSchema } from "@/validations/project";

// Component: Modern Tag / Chip / Autocomplete Input for Skills
const SkillTagCombobox = ({ value = [], onChange, categorySkills = [], categoryName = "" }) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSkill = (skillLabel) => {
    const trimmed = (skillLabel || "").trim();
    if (!trimmed) return;
    if (!value.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(value.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddSkill(inputValue.trim());
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      handleRemoveSkill(value[value.length - 1]);
    }
  };

  // Filter skills based on user input
  const filteredSuggestions = categorySkills.filter((skill) => {
    const isAlreadySelected = value.some(
      (v) => v.toLowerCase() === skill.label.toLowerCase() || v.toLowerCase() === skill.id.toLowerCase()
    );
    const matchesInput = skill.label.toLowerCase().includes(inputValue.toLowerCase());
    return !isAlreadySelected && (inputValue ? matchesInput : true);
  });

  const exactMatchExists = categorySkills.some(
    (s) => s.label.toLowerCase() === inputValue.trim().toLowerCase()
  );

  return (
    <div className="flex flex-col gap-3 w-full" ref={dropdownRef}>
      {/* Selected Tags Display Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-[48px] p-2 bg-white border border-gray-200 rounded-lg flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm cursor-text"
      >
        {value.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors pl-2.5 pr-1.5 py-1 text-xs sm:text-sm font-medium flex items-center gap-1.5 rounded-md"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveSkill(skill);
              }}
              className="hover:bg-primary/30 rounded-full p-0.5 transition-colors text-primary"
            >
              <LuX className="w-3.5 h-3.5" />
            </button>
          </Badge>
        ))}

        {/* Input for typing/searching */}
        <div className="flex-1 min-w-[140px] flex items-center gap-1.5 px-1">
          <HiMiniMagnifyingGlass className="text-gray-400 text-base" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              value.length === 0
                ? "Type to search skills or enter custom skill (press Enter)..."
                : "Add more skills..."
            }
            className="w-full bg-transparent border-none outline-none text-sm text-black placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm"
          />
        </div>

        {value.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="relative">
          <div className="absolute z-50 top-0 left-0 right-0 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 flex flex-col gap-1 animate-in fade-in-50 zoom-in-95">
            {filteredSuggestions.slice(0, 15).map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleAddSkill(skill.label)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md flex items-center justify-between transition-colors"
              >
                <span>{skill.label}</span>
                <MdAdd className="text-gray-400 text-base" />
              </button>
            ))}

            {inputValue.trim() && !exactMatchExists && (
              <button
                type="button"
                onClick={() => handleAddSkill(inputValue.trim())}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-md flex items-center justify-between font-medium text-primary border-t border-gray-100"
              >
                <span>Add custom skill: &quot;{inputValue.trim()}&quot;</span>
                <span className="text-xs text-gray-400 font-normal">Press Enter</span>
              </button>
            )}

            {filteredSuggestions.length === 0 && !inputValue.trim() && (
              <div className="px-3 py-4 text-center text-xs text-gray-400">
                All skills in this category are already selected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggested Quick-Add Pills */}
      {categorySkills.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <LuSparkles className="text-amber-500" />
            Recommended for {categoryName || "selected category"}:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {categorySkills.slice(0, 18).map((skill) => {
              const isSelected = value.some(
                (v) => v.toLowerCase() === skill.label.toLowerCase() || v.toLowerCase() === skill.id.toLowerCase()
              );
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() =>
                    isSelected ? handleRemoveSkill(skill.label) : handleAddSkill(skill.label)
                  }
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs font-medium"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {isSelected ? <LuCheck className="w-3 h-3" /> : <MdAdd className="w-3 h-3 text-gray-400" />}
                  {skill.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const CreateJobForm = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  // Milestone Feature
  const [milestones, setMilestones] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [milestoneData, setMilestoneData] = useState({
    title: "",
    description: "",
    amount: "",
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const form = useForm({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      projectCategory: "",
      skills: [],
      budget: "",
      duration: "",
      clientId: "",
    },
  });

  // Calculate total milestone percentage
  useEffect(() => {
    let total = 0;
    milestones.forEach((item) => {
      total += parseFloat(item.amount) || 0;
    });
    setTotalPercentage(total);
    if (total !== 100 || milestones.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  }, [milestones]);

  // Load session storage user data
  useEffect(() => {
    if (!userData) {
      const data = sessionStorage.getItem("karmsetu");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setUserData(parsed);
          if (parsed?.id) {
            form.setValue("clientId", parsed.id);
          }
        } catch (e) {
          console.error("Invalid session storage", e);
        }
      }
    }
  }, [userData, form]);

  // Get client geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (err) => {
          console.error("Error getting geolocation: ", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Update skills list when project category changes
  const selectedCategory = form.watch("projectCategory");
  useEffect(() => {
    switch (selectedCategory) {
      case "web-development":
        setSelectedSkills(webDevelopmentSkills);
        break;
      case "app-development":
        setSelectedSkills(appDevelopmentSkills);
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
  }, [selectedCategory]);

  // Razorpay SDK loading
  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = (values) => {
    const { title, budget, description } = values;
    const name = userData?.name || "";
    const phone = userData?.phone || "";
    const email = userData?.email || "";

    // Razorpay description field has a strict 255 character limit
    const safeDescription = (description || "Project Escrow Payment")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

    const safeTitle = (title || "Project Job Posting")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 45);

    return new Promise((resolve) => {
      if (!sdkReady || typeof window === "undefined" || !window.Razorpay) {
        console.error("Razorpay SDK is not ready.");
        resolve(false);
        return;
      }

      setIsProcessing(true);

      fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(budget) }),
      })
        .then((response) => response.json())
        .then((data) => {
          const orderId = data.orderId || data.order_id;
          if (!orderId) {
            console.error("No order ID returned from payment API", data);
            resolve(false);
            return;
          }

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Number(budget) * 100,
            currency: "INR",
            name: "KarmSetu",
            description: safeDescription || `Payment for ${safeTitle}`,
            order_id: orderId,
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
        .catch((err) => {
          console.error("Failed to fetch payment data", err);
          resolve(false);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    });
  };

  const fetchDataAI = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_AI_API}/fetch-data/`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_code: true }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching AI data:", error);
    }
  };

  const onSubmitForm = async (values) => {
    if (error) {
      toast.error("Please configure project milestones to total exactly 100%.");
      return;
    }
    if (milestones.length === 0) {
      toast.error("You must set at least one milestone for the project.");
      return;
    }
    if (isProcessing || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentSuccessful = await handlePayment(values);
      if (!paymentSuccessful) {
        toast.error("Payment was not completed or was cancelled.");
        setIsSubmitting(false);
        return;
      }

      const clientName = userData?.name;
      const response = await axios.post("/api/projects/Project", {
        values,
        clientName,
        coordinates,
        milestones,
      });

      console.log(response.data.savedProject?._id, "Response");
      toast.success("Job posted successfully! Redirecting...");
      fetchDataAI().catch((err) => console.error("AI fetch error:", err));
      router.push("/cl/jobs");
    } catch (err) {
      console.error(
        "Error occurred:",
        err.response ? err.response.data : err.message
      );
      toast.error(
        err.response?.data?.message || "Failed to post job. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Milestone Dialog Handlers
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
    setMilestoneData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMilestone = () => {
    const amountNum = parseFloat(milestoneData.amount);
    if (!milestoneData.title.trim()) {
      toast.error("Milestone title is required");
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > 100) {
      toast.error("Please enter a valid percentage between 1 and 100");
      return;
    }

    if (selectedMilestone !== null) {
      const updated = milestones.map((m, i) =>
        i === selectedMilestone ? { ...milestoneData, amount: amountNum } : m
      );
      setMilestones(updated);
    } else {
      setMilestones([...milestones, { ...milestoneData, amount: amountNum }]);
    }
    handleCloseDialog();
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const currentCategoryLabel =
    projectCategories.find((c) => c.value === selectedCategory)?.label || "";

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-7 mb-4">
          {/* 1. Job Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                  <LuClipboardList className="text-primary text-lg" />
                  Job Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Build a Responsive E-Commerce Web Application"
                    className="border-gray-200 text-black placeholder:text-gray-400 focus-visible:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 2. Project Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                  <TbListDetails className="text-primary text-lg" />
                  Project Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide detailed information about the project goals, deliverables, and expectations..."
                    className="min-h-[120px] resize-y border-gray-200 text-black placeholder:text-gray-400 focus-visible:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 3. Project Category */}
          <FormField
            control={form.control}
            name="projectCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                  <BsBriefcase className="text-primary text-lg" />
                  Project Category
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto">
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

          {/* 4. Skills (Tag / Combobox Chips Input) */}
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                    <LuSparkles className="text-primary text-lg" />
                    Required Skills & Technologies
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500 mt-0.5">
                    Select from autocomplete recommendations or type custom skills and press Enter.
                  </FormDescription>
                </div>
                <FormControl>
                  <SkillTagCombobox
                    value={field.value || []}
                    onChange={field.onChange}
                    categorySkills={selectedSkills}
                    categoryName={currentCategoryLabel}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 5. Budget & Duration in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                    <MdOutlineCurrencyRupee className="text-primary text-lg" />
                    Budget (INR)
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 font-semibold">₹</span>
                      <Input
                        placeholder="e.g. 15000"
                        type="number"
                        className="pl-8 border-gray-200 text-black placeholder:text-gray-400 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                    <GiSandsOfTime className="text-primary text-lg" />
                    Duration / Deadline
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 2 Weeks, 1 Month"
                      className="border-gray-200 text-black placeholder:text-gray-400 focus-visible:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 6. Project Milestones Section */}
          <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-200 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <FormLabel className="text-black font-semibold flex items-center gap-1.5 text-base">
                  <GiProgression className="text-primary text-lg" />
                  Project Milestones
                </FormLabel>
                <p className="text-xs text-gray-500 mt-0.5">
                  Break down your project into milestone deliverables totaling exactly 100%.
                </p>
              </div>

              {/* Total Percentage Indicator */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    totalPercentage === 100
                      ? "bg-green-100 text-green-700 border-green-300"
                      : totalPercentage > 100
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-amber-100 text-amber-700 border-amber-300"
                  }`}
                >
                  Allocated: {totalPercentage}% / 100%
                </span>
              </div>
            </div>

            {/* Milestones List */}
            {milestones.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="p-3.5 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">
                          {milestone.title}
                        </span>
                        {milestone.description && (
                          <span className="text-xs text-gray-500 mt-0.5">
                            {milestone.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
                        {milestone.amount}%
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(milestone, index)}
                          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <MdOutlineEdit className="text-base" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMilestone(index)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <MdDeleteForever className="text-base" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenDialog()}
                className="text-primary border-primary/30 hover:bg-primary/5 gap-1 font-medium"
              >
                <MdAdd className="text-lg" />
                Add Milestone
              </Button>
            </div>
          </div>

          {/* Milestone Modal Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {selectedMilestone !== null ? "Edit Milestone" : "Add Project Milestone"}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Specify the milestone title, scope description, and payment percentage share.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Milestone Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={milestoneData.title}
                    onChange={handleChangeMilestone}
                    placeholder="e.g. Initial UI/UX Wireframes & Prototypes"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Description (Optional)</label>
                  <Textarea
                    name="description"
                    value={milestoneData.description}
                    onChange={handleChangeMilestone}
                    placeholder="Details about what will be delivered for this milestone..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Payment Percentage (%)
                  </label>
                  <Input
                    type="number"
                    name="amount"
                    value={milestoneData.amount}
                    onChange={handleChangeMilestone}
                    placeholder="e.g. 25"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveMilestone} className="bg-primary hover:bg-primaryho text-white">
                  Save Milestone
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || isProcessing || error}
              className="w-full sm:w-auto min-w-[180px] bg-primary hover:bg-primaryho text-white font-semibold py-2.5 px-8 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Processing Payment...
                </>
              ) : isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Creating Job...
                </>
              ) : (
                "Post Job & Pay"
              )}
            </Button>
            {error && (
              <p className="text-xs text-red-500 mt-2 font-medium">
                * Milestones must be configured to total exactly 100% before posting.
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateJobForm;

