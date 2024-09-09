import User from "@/app/(models)/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, phoneNumber, age, gender, address, bio, socialMedia, professionalTitle, skills, portfolioLink, role, coordinates, photo } = body;
        // console.log(coordinates, "Params")
        //console.log("Image Link from Params", photo);
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update fields only if provided
        if (phoneNumber) user.phone = phoneNumber;
        if (age) user.age = age;
        if (gender !== undefined) user.gender = gender;
        if (address) user.address = address;
        if (bio) user.bio = bio;
        if (socialMedia) user.socialMedia = socialMedia;
        if (professionalTitle) user.professionalTitle = professionalTitle;
        if (skills) user.skill = skills;
        if (portfolioLink) user.portfolio = portfolioLink;
        if (role) user.role = role;
        if(photo) user.imageLink = photo;

        // Update coordinates if they are passed and valid
        if (coordinates) {
            if (typeof coordinates.latitude === 'number' && typeof coordinates.longitude === 'number') {
                user.coordinates = {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
                };
            } else {
                return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 });
            }
        }

        await user.save();

        return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
    }
}
