import Application from "@/app/(models)/application";
import { NextResponse } from "next/server";
import { connect } from "@/config/db";

connect();

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Client ID is required." }, { status: 400 });
    }

    // Find all applications with the given clientId, sorted by createdAt descending (newest on top)
    const applications = await Application.find({ clientId: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(
      {
        message: "Applications data successfully retrieved",
        applications: applications || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving application data:", error.message);
    return NextResponse.json(
      {
        message: "Error retrieving application data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

