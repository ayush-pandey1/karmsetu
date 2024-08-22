import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from 'cookie';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, PhoneNumber, age, gender, address, bio, socialMedia, professionalTitle, skills, portfolioLink, role } = body;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (PhoneNumber) user.phone = PhoneNumber;
        if (age) user.age = age;
        if (gender !== undefined) user.gender = gender; 
        if (address) user.address = address;
        if (bio) user.bio = bio;
        if (socialMedia) user.socialMedia = socialMedia;
        if (professionalTitle) user.professionalTitle = professionalTitle;
        if (skills) user.skill = skills;
        if (portfolioLink) user.portfolio = portfolioLink;
        if (role) user.role = role;

        await user.save();

        return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
    }
}
