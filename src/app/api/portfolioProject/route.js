import { NextResponse } from "next/server";
import User from "@/app/(models)/User";
import { portfolioProjectSchema } from "@/validations/portfolio";
import { validateRequestBody } from "@/validations/middleware";

export async function PUT(req) {
    try {
        const body = await req.json();
        const { freelancerId, newProject } = body || {};

        if (!freelancerId || typeof freelancerId !== "string" || !freelancerId.trim()) {
            return NextResponse.json(
                { message: "Freelancer ID is required." },
                { status: 400 }
            );
        }

        const projectVal = validateRequestBody(portfolioProjectSchema, newProject);
        if (!projectVal.success) {
            return projectVal.response;
        }

        const freelancerDetails = await User.findById(freelancerId.trim());
        if (!freelancerDetails) {
            return NextResponse.json(
                { message: "No freelancer found" },
                { status: 404 }
            );
        }

        if (!Array.isArray(freelancerDetails.portfolioDetails)) {
            freelancerDetails.portfolioDetails = [];
        }

        freelancerDetails.portfolioDetails.push(projectVal.data);
        await freelancerDetails.save();

        return NextResponse.json(
            { message: "Successfully created portfolio project", project: projectVal.data },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in creating portfolio project:", error.message);
        return NextResponse.json(
            { message: "Error in creating portfolio project", error: error.message },
            { status: 500 }
        );
    }
}