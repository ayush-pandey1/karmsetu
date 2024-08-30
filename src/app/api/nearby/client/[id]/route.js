import User from "@/app/(models)/User"; 
import { NextResponse } from "next/server";
import { getDistance } from "geolib";

export async function GET(req, { params }) {
  const clientId = params.id;  

  try {
    const client = await User.findById(clientId);
    
    if (!client || !client.coordinates || !client.coordinates.latitude || !client.coordinates.longitude) {
      return NextResponse.json({ error: "Client not found or coordinates missing" }, { status: 404 });
    }

    const clientCoords = {
      latitude: client.coordinates.latitude,
      longitude: client.coordinates.longitude,
    };

    const freelancers = await User.find({ role: 'freelancer' });

    const nearbyFreelancers = freelancers.filter((freelancer) => {
      if (freelancer.coordinates && freelancer.coordinates.latitude && freelancer.coordinates.longitude) {
        const distance = getDistance(clientCoords, {
          latitude: freelancer.coordinates.latitude,
          longitude: freelancer.coordinates.longitude,
        });

        return distance <= 5000;
      }
      return false;
    });

    return NextResponse.json({ nearbyFreelancers });
  } catch (error) {
    console.error("Error fetching nearby freelancers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
