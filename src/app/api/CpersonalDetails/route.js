import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

export async function PUT(req) {
  try {
    const data = await req.json();
    const { email, phoneNumber, age, gender, address, companyName, industry, bio, socialMedia, role, coordinates } = data;

    const updatedUser = await User.findOneAndUpdate(
      { email }, 
      {
        phone: phoneNumber,
        age,
        gender,
        address,
        companyName,
        industry,
        bio,
        socialMedia,
        role,
        // if (coordinates.latitude && coordinates.longitude){
          coordinates:{
            latitude:coordinates?.latitude,
            longitude:coordinates?.longitude
          } 
          
      // }
      },
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
