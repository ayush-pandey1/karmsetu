"use client";

import { useEffect, useState, useMemo } from "react";
import JobCardFreelancer from "@/components/JobCardFreelancer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbAdjustmentsStar } from "react-icons/tb";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFreelancerProjects,
  fetchProjects,
} from "@/app/(redux)/features/freelancerProjects";
import {
  LuBriefcase,
  LuCheckCircle2,
  LuClock,
  LuFlame,
  LuSearchX,
  LuLayoutGrid,
  LuList,
  LuArrowUpDown,
  LuSparkles,
} from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import "./style.css";

const CATEGORIES = [
  "All Categories",
  "Web Development",
  "Mobile App Development",
  "UI/UX & Graphic Design",
  "Content & Copywriting",
  "Software & Tech",
  "Video & Animation",
  "Digital Marketing",
  "Consulting & Business",
];

const SkeletonJobCard = ({ isListView }) => {
  if (isListView) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-xs flex items-center justify-between gap-4 animate-pulse w-full">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-48 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-3 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded-xl shrink-0" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-xs flex flex-col justify-between h-72 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-1">
              <div className="w-20 h-3 bg-gray-200 rounded" />
              <div className="w-12 h-2.5 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="w-20 h-5 bg-gray-100 rounded-full" />
        </div>
        <div className="w-3/4 h-4 bg-gray-200 rounded mt-1" />
        <div className="w-full h-3 bg-gray-100 rounded" />
        <div className="w-2/3 h-3 bg-gray-100 rounded" />
        <div className="flex gap-1.5 pt-1">
          <div className="w-14 h-5 bg-gray-100 rounded" />
          <div className="w-16 h-5 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="w-24 h-7 bg-gray-100 rounded-lg" />
        <div className="w-24 h-8 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

export default function Home() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [maxBudget, setMaxBudget] = useState(50000);
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "budget-desc" | "budget-asc"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("karmsetu"));
    if (data) {
      setUserData(data);
    }
  }, []);

  const rawProjects = useSelector((state) => state.freelancer.projects || []);
  const allProject = useSelector((state) => state.freelancer.allFreelancerProjects || 0);
  const completedProject = useSelector((state) => state.freelancer.CompletedProjects || 0);
  const ongoingProject = useSelector((state) => state.freelancer.OngoingProjects || 0);
  const reduxStatus = useSelector((state) => state.freelancer.status);
  const isProjectsLoading = reduxStatus === "loading" && rawProjects.length === 0;

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const freelancerId = userData?.id || userData?._id;

  useEffect(() => {
    if (freelancerId) {
      dispatch(fetchFreelancerProjects(freelancerId));
    }
  }, [freelancerId, dispatch]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (error) => console.error("Error getting geolocation: ", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const updateCoordinates = async () => {
      const data = JSON.parse(sessionStorage.getItem("karmsetu"));
      if (!data?.email || !coordinates.latitude) return;
      try {
        await fetch("/api/FpersonalDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data?.email, coordinates }),
        });
      } catch (err) {
        console.error("Error updating coordinates", err);
      }
    };

    if (coordinates.latitude && coordinates.longitude) {
      updateCoordinates();
    }
  }, [coordinates]);

  // Client-side multi-filter & sorting
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(rawProjects)) return [];

    let list = rawProjects.filter((project) => {
      // 1. Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const titleMatch = project.title?.toLowerCase().includes(q);
        const descMatch = project.description?.toLowerCase().includes(q);
        const techMatch = (project.technologies || project.skills || []).some(
          (t) => (typeof t === "object" ? t.label || t.id : t).toLowerCase().includes(q)
        );
        if (!titleMatch && !descMatch && !techMatch) return false;
      }

      // 2. Category filter
      if (selectedCategory && selectedCategory !== "All Categories") {
        const cat = (project.projectCategory || "").toLowerCase();
        const selected = selectedCategory.toLowerCase();
        if (!cat.includes(selected) && !selected.includes(cat)) return false;
      }

      // 3. Budget filter
      if (maxBudget && Number(project.budget) > maxBudget) {
        return false;
      }

      return true;
    });

    // Sort order
    if (sortBy === "budget-desc") {
      list.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
    } else if (sortBy === "budget-asc") {
      list.sort((a, b) => Number(a.budget || 0) - Number(b.budget || 0));
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [rawProjects, searchQuery, selectedCategory, maxBudget, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "All Categories" || maxBudget < 50000;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setMaxBudget(50000);
    setSortBy("newest");
  };

  return (
    <div className="flex flex-col gap-6 p-3 sm:p-6 max-w-7xl mx-auto w-full">
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-50 to-sky-50 border border-primary/15 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-primary/20 text-primary text-xs font-bold mb-2 shadow-2xs">
            <LuSparkles className="text-amber-500" />
            <span>Freelancer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            Welcome back,{" "}
            <span className="text-primary font-black">
              {userData?.name || "Freelancer"}
            </span>{" "}
            👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
            Explore live gigs matched to your skill profile, submit proposals, and chat in real-time with verified clients.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/fl/nearby"
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-primary bg-white hover:bg-primary/5 border border-primary/30 rounded-2xl transition-all shadow-xs flex items-center gap-2"
          >
            <LuFlame className="text-amber-500 text-base" />
            <span>Nearby Gigs Explorer</span>
          </a>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Available Gigs */}
        <Card className="rounded-2xl border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pt-4 pb-2 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Available Gigs
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <TbAdjustmentsStar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {rawProjects?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Live in marketplace</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Ongoing Gigs */}
        <Card className="rounded-2xl border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pt-4 pb-2 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              In Progress
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <LuClock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {ongoingProject}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active client contracts</p>
          </CardContent>
        </Card>

        {/* Metric 3: Completed Gigs */}
        <Card className="rounded-2xl border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pt-4 pb-2 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Completed
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <LuCheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {completedProject}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        {/* Metric 4: Lifetime Projects */}
        <Card className="rounded-2xl border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pt-4 pb-2 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              My Total Projects
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <LuBriefcase className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {allProject}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Category Quick-Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-primary text-white border-primary shadow-xs scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-gray-200/80"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. Search and Multi-Filter Controls Toolbar */}
      <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <HiMiniMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <Input
            type="text"
            placeholder="Search gigs by title, skill, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8 h-11 bg-gray-50/70 border-gray-200 rounded-xl text-sm font-medium focus-visible:ring-primary focus-visible:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Sort By Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[170px] h-11 border-gray-200 bg-gray-50/70 rounded-xl text-xs sm:text-sm font-semibold text-gray-700">
              <LuArrowUpDown className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="newest" className="text-xs sm:text-sm font-medium">
                Newest First
              </SelectItem>
              <SelectItem value="budget-desc" className="text-xs sm:text-sm font-medium">
                Budget: High to Low
              </SelectItem>
              <SelectItem value="budget-asc" className="text-xs sm:text-sm font-medium">
                Budget: Low to High
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Budget Range Control */}
          <div className="bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-1.5 flex flex-col justify-center min-w-[170px]">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
              <span>Max Budget:</span>
              <span className="text-emerald-700 font-bold">₹{maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
            />
          </div>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-sm transition-all ${
                viewMode === "grid"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <LuLayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-sm transition-all ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              title="List View"
            >
              <LuList className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-11 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-3 shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* 5. Section Header & Results Count */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Available Gigs
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {filteredProjects.length}
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium hidden sm:block">
          Click any card to view scope & submit proposal
        </p>
      </div>

      {/* 6. Gigs Grid / List */}
      {isProjectsLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonJobCard key={idx} isListView={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonJobCard key={idx} isListView={true} />
            ))}
          </div>
        )
      ) : filteredProjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-backwards"
                style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
              >
                <JobCardFreelancer project={project} isListView={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-backwards"
                style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
              >
                <JobCardFreelancer project={project} isListView={true} />
              </div>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto w-full my-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <LuSearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No gigs matched your criteria</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-sm">
            Try adjusting your search query, selecting a different category, or raising the budget slider to discover more opportunities.
          </p>
          {hasActiveFilters && (
            <Button
              onClick={resetFilters}
              className="mt-5 bg-primary hover:bg-primaryho text-white rounded-xl text-xs font-semibold px-5 py-2 shadow-xs"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
