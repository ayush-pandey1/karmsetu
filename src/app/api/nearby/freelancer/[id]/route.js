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
  try {
    const freelancerId = params.id; 

    const freelancer = await User.findById(freelancerId);
    
    if (!freelancer || !freelancer.coordinates || freelancer.coordinates.latitude === null) {
      return NextResponse.json({ message: "Freelancer or coordinates not found" }, { status: 404 });
    }

    const freelancerCoords = freelancer.coordinates;

    const projects = await Project.find({ status: "Pending" });

    const nearbyProjects = [];

    projects.forEach((project) => {
      if (project.coordinates && project.coordinates.latitude !== null) {
        const projectCoords = project.coordinates;
        const distance = calculateDistance(freelancerCoords, projectCoords); 

        if (distance <= 5000) {

          nearbyProjects.push({
            ...project._doc, 
            distance: distance / 1000, 
          });
        }
      }
    });

    return NextResponse.json(nearbyProjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby projects:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
