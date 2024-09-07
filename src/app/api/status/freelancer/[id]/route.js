import Project from "@/app/(models)/project"; 
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params; 
    const { status, milestoneId,message } = await req.json();
    if (!id || !milestoneId || !status || !message) {
      return NextResponse.json(
        { message: "Project ID, Milestone ID, message, and status are required." },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const milestone = project.milestones.find(
      (milestone) => milestone._id.toString() === milestoneId
    );

    if (!milestone) {
      return NextResponse.json(
        { message: "Milestone not found." },
        { status: 404 }
      );
    }

    milestone.status = status;
    milestone.message=message;
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
