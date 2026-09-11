import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import { freelancerProfileSchema } from "@/validations/user";
import { validateRequestBody } from "@/validations/middleware";

export async function POST(req) {
    try {
        const body = await req.json();

        // Check if this is a coordinate-only update
        if (body.email && body.coordinates && Object.keys(body).length === 2) {
            const email = String(body.email).trim().toLowerCase();
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
            user.coordinates = body.coordinates;
            await user.save();
            return NextResponse.json({ message: "Coordinates updated", user }, { status: 200 });
        }

        const validation = validateRequestBody(freelancerProfileSchema, body);
        if (!validation.success) {
            return validation.response;
        }

        const {
            email,
            phoneNumber,
            age,
            gender,
            address,
            bio,
            socialMedia,
            professionalTitle,
            skills,
            portfolioLink,
            coordinates,
            photo
        } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.phone = phoneNumber;
        user.age = age;
        user.gender = gender;
        user.address = address;
        user.bio = bio;
        user.socialMedia = socialMedia || "";
        user.professionalTitle = professionalTitle;
        user.skill = skills;
        user.portfolio = portfolioLink || "";
        user.role = "freelancer";
        if (photo !== undefined) user.imageLink = photo || "";
        if (coordinates) user.coordinates = coordinates;

        await user.save();

        return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
    } catch (error) {
        console.error("Error updating freelancer profile:", error);
        return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
    }
}

