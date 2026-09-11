import { connect } from "../../../../config/db";
import ProjectSchema from "../../../(models)/project";
import { NextRequest, NextResponse } from "next/server";
import { createJobSchema, milestoneItemSchema } from "@/validations/project";
import { validateRequestBody } from "@/validations/middleware";

connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { values, clientName, coordinates, milestones } = reqBody;

    if (!values) {
      return NextResponse.json({ message: "Job values are required" }, { status: 400 });
    }

    const jobValidation = validateRequestBody(createJobSchema, values);
    if (!jobValidation.success) {
      return jobValidation.response;
    }

    if (!Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json({ message: "At least one milestone is required" }, { status: 400 });
    }

    // Validate each milestone
    let totalPercentage = 0;
    const validatedMilestones = [];
    for (let i = 0; i < milestones.length; i++) {
      const mVal = validateRequestBody(milestoneItemSchema, milestones[i]);
      if (!mVal.success) {
        return mVal.response;
      }
      totalPercentage += mVal.data.amount;
      validatedMilestones.push({
        ...mVal.data,
        amount: String(mVal.data.amount),
      });
    }

    if (Math.round(totalPercentage) !== 100) {
      return NextResponse.json(
        { message: `Milestones must total exactly 100% (currently ${totalPercentage}%)` },
        { status: 400 }
      );
    }

    const { title, description, budget, projectCategory, duration, clientId, skills } = jobValidation.data;

    const newProject = new ProjectSchema({
      title,
      description,
      budget,
      technologies: skills,
      duration,
      projectCategory,
      clientId,
      clientName: (clientName || "Client").trim().slice(0, 120),
      coordinates: {
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      },
      milestones: validatedMilestones,
    });

    const savedProject = await newProject.save();
    return NextResponse.json(
      { message: "Project created successfully", success: true, savedProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error.message);
    return NextResponse.json({ message: error.message || "Failed to create project", error: error.message }, { status: 500 });
  }
}


export async function GET(NextRequest) {
  try {
    const clientId = NextRequest.nextUrl.searchParams.get('clientId');

    if (clientId) {
      const data = await ProjectSchema.find({ clientId });
      if (data.length == 0) {
        return NextResponse.json({ message: "No Projects", success: true, empty: true }, { status: 200 });
      }

      return NextResponse.json({ message: "Fetched Data Successfully", success: true, data }, { status: 200 });
    } else {
      const data = await ProjectSchema.find({ status: "Pending" });
      if (data.length == 0) {
        return NextResponse.json({ message: "No Projects", success: true, empty: true }, { status: 200 });
      }
      return NextResponse.json({ message: "Fetched Data Successfully", success: true, data }, { status: 200 });
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}
