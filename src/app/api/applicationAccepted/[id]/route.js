import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { freelancerId } = await req.json(); 

    if (!id || !freelancerId) {
      return NextResponse.json(
        { message: "Project ID and Freelancer ID are required." },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    // Update the freelancerId and set the status to "In Progress"
    project.freelancerId = freelancerId;
    project.status = "In Progress";

    // Save the updated project
    await project.save();

    return NextResponse.json(
      {
        message: "Freelancer assigned and project status updated to In Progress.",
        project,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      {
        message: "Error updating project.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
