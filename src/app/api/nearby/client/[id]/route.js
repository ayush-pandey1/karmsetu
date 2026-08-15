import User from "@/app/(models)/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";
import { getDistance } from "geolib";

export async function GET(req, { params }) {
  const clientId = params.id;

  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const distanceParam = searchParams.get("distance");
    // Distance parameter is in kilometers (default to 5 km if not provided)
    const selectedDistanceKm = distanceParam ? parseFloat(distanceParam) : 5;
    const maxDistanceMeters = selectedDistanceKm * 1000;

    const client = await User.findById(clientId).select("-password").lean();

    if (
      !client ||
      !client.coordinates ||
      client.coordinates.latitude == null ||
      client.coordinates.longitude == null
    ) {
      return NextResponse.json(
        { error: "Client not found or coordinates missing" },
        { status: 404 }
      );
    }

    const clientCoords = {
      latitude: client.coordinates.latitude,
      longitude: client.coordinates.longitude,
    };

    const freelancers = await User.find({
      role: "freelancer",
      _id: { $ne: clientId },
    })
      .select("-password")
      .lean();

    const nearbyFreelancers = freelancers
      .filter((freelancer) => {
        return (
          freelancer.coordinates &&
          freelancer.coordinates.latitude != null &&
          freelancer.coordinates.longitude != null &&
          !isNaN(freelancer.coordinates.latitude) &&
          !isNaN(freelancer.coordinates.longitude)
        );
      })
      .map((freelancer) => {
        const distanceMeters = getDistance(clientCoords, {
          latitude: freelancer.coordinates.latitude,
          longitude: freelancer.coordinates.longitude,
        });

        return {
          ...freelancer,
          distance: Math.round((distanceMeters / 1000) * 10) / 10, // distance in km rounded to 1 decimal
          distanceMeters,
        };
      })
      .filter((freelancer) => freelancer.distanceMeters <= maxDistanceMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    return NextResponse.json({ nearbyFreelancers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby freelancers:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
