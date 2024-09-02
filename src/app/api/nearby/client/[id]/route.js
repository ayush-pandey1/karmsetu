import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import { getDistance } from "geolib";

export async function GET(req, { params }) {
  const clientId = params.id;

  try {
    // Extracting the distance from the query parameters using `req.nextUrl.searchParams`
    const searchParams = req.nextUrl.searchParams;
    const distanceParam = searchParams.get('distance');
    const selectedDistance = distanceParam ? parseInt(distanceParam, 10) : 5000; // Default to 5000 if no distance is provided

    console.log("Selected Distance:", selectedDistance); // Log selected distance

    const client = await User.findById(clientId);

    if (!client || !client.coordinates || !client.coordinates.latitude || !client.coordinates.longitude) {
      return NextResponse.json({ error: "Client not found or coordinates missing" }, { status: 404 });
    }

    const clientCoords = {
      latitude: client.coordinates.latitude,
      longitude: client.coordinates.longitude,
    };

    console.log("Client Coordinates:", clientCoords); // Log client coordinates

    const freelancers = await User.find({ role: 'freelancer' });

    const nearbyFreelancers = freelancers.filter((freelancer) => {
      if (freelancer.coordinates && freelancer.coordinates.latitude && freelancer.coordinates.longitude) {
        const distance = getDistance(clientCoords, {
          latitude: freelancer.coordinates.latitude,
          longitude: freelancer.coordinates.longitude,
        });

        console.log(`Freelancer distance: ${distance}, Filter: ${distance <= selectedDistance}`); // Log distance and filter result

        return distance <= selectedDistance*1000;
      }
      return false;
    });

    return NextResponse.json({ nearbyFreelancers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby freelancers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
