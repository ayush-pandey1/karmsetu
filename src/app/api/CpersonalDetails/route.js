import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { clientProfileSchema } from "@/validations/user";
import { validateRequestBody } from "@/validations/middleware";

if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGO_URL);
}
mongoose.Promise = global.Promise;

export async function PUT(req) {
  try {
    const rawData = await req.json();

    // Check if this is a coordinate-only update
    if (rawData.email && rawData.coordinates && Object.keys(rawData).length === 2) {
      const email = String(rawData.email).trim().toLowerCase();
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { coordinates: rawData.coordinates },
        { new: true, runValidators: false }
      );
      if (!updatedUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Coordinates updated", user: updatedUser }, { status: 200 });
    }

    const validation = validateRequestBody(clientProfileSchema, rawData);
    if (!validation.success) {
      return validation.response;
    }

    const {
      email,
      phoneNumber,
      age,
      gender,
      address,
      companyName,
      industry,
      bio,
      socialMedia,
      photo,
      coordinates
    } = validation.data;

    const updateFields = {
      phone: phoneNumber,
      age,
      gender,
      address,
      companyName,
      industry,
      bio,
      socialMedia: socialMedia || "",
      imageLink: photo || "",
      role: "client"
    };

    if (coordinates) {
      updateFields.coordinates = coordinates;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email }, 
      updateFields,
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Failed to update user", error: error.message }, { status: 500 });
  }
}

