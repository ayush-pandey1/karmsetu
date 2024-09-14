import { NextResponse } from "next/server";
import User from "@/app/(models)/User"

export async function PUT(req) {
    try {
        const { freelancerId, newProject } = await req.json();

        if (!freelancerId || !newProject) {
            return NextResponse.json(
                { message: "Project Details and Freelancer ID are required." },
                { newStatus: 400 }
            );
        }
        console.log(freelancerId, newProject, "From project creation API for the freelancer portfolio");
        const freelancerDetails = await User.findOne({ _id: freelancerId });
        if (!freelancerDetails) {
            return NextResponse.json(
                { message: "No freelancer found" },
                { status: 404 }
            )
        }
        // Check if portfolioDetails exists and is an array
        if (!Array.isArray(freelancerDetails.portfolioDetails)) {
            // Initialize portfolioDetails as an empty array if it doesn't exist
            freelancerDetails.portfolioDetails = [];
        }
        await freelancerDetails.portfolioDetails.push(newProject);
        await freelancerDetails.save();
        return NextResponse.json(
            { message: "Successfully created portfolio project" },
            { status: 201 }
        )
    } catch (error) {
        console.log("Error in creating portfolio project", error.message);
        return NextResponse.json(
            { message: "Error in creating portfolio project" },
            { status: 404 },
            { error: error.message }
        )
    }
}