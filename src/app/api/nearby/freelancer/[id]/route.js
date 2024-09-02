import User from "@/app/(models)/User"; 
import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";
import { getDistance } from "geolib";

function calculateDistance(userCoords, projectCoords) {
  return getDistance(
    { latitude: userCoords.latitude, longitude: userCoords.longitude },
    { latitude: projectCoords.latitude, longitude: projectCoords.longitude }
  );
}

export async function GET(req, { params }) {
  const freelancerId = params.id;
  try {
    
    const searchParams = req.nextUrl.searchParams;
    const distanceParam = searchParams.get('distance');
    const selectedDistance = distanceParam ? parseInt(distanceParam, 10) : 5000; 

    const freelancer = await User.findById(freelancerId);

    if (!freelancer || !freelancer.coordinates || !freelancer.coordinates.latitude || !freelancer.coordinates.longitude) {
      return NextResponse.json({ message: "Freelancer or coordinates not found" }, { status: 404 });
    }

    const freelancerCoords = freelancer.coordinates;

    const projects = await Project.find({ status: "Pending" });

    const nearbyProjects = projects
      .filter((project) => project.coordinates && project.coordinates.latitude !== null)
      .map((project) => {
        const projectCoords = project.coordinates;
        const distance = calculateDistance(freelancerCoords, projectCoords);

        return {
          ...project._doc,
          distance: distance / 1000, // Convert meters to kilometers
        };
      })
      .filter((project) => project.distance <= selectedDistance); // Filter projects based on distance

    return NextResponse.json(nearbyProjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby projects:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
