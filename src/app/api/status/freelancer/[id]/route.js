import Project from "@/app/(models)/project"; 
import { NextResponse } from "next/server";
import { freelancerMilestoneReviewSchema } from "@/validations/project";
import { validateRequestBody } from "@/validations/middleware";

export async function PATCH(req, { params }) {
  try {
    const { id } = params; 
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    const validation = validateRequestBody(freelancerMilestoneReviewSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { status, milestoneId, message } = validation.data;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const milestone = project.milestones.find(
      (m) => m._id.toString() === milestoneId
    );

    if (!milestone) {
      return NextResponse.json(
        { message: "Milestone not found." },
        { status: 404 }
      );
    }

    milestone.status = status;
    milestone.message = message;
    milestone.statusDate = new Date();
    await project.save();

    return NextResponse.json(
      { message: "Milestone status updated successfully.", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating milestone status:", error.message);
    return NextResponse.json(
      { message: "Error updating milestone status", error: error.message },
      { status: 500 }
    );
  }
}

