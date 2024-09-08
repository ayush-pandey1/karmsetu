import Project from "@/app/(models)/project"; 
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params; 
    const { milestoneId, status } = await req.json(); 

    if (!id || !milestoneId || !status) {
      return NextResponse.json(
        { message: "Project ID, milestone ID, and status are required." },
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
      return NextResponse.json({ message: "Milestone not found." }, { status: 404 });
    }

    if (status === "Not Applied") {
      milestone.status = "Not Applied";
    } else if (status === "Approved") {
      milestone.status = "Approved";
      milestone.paymentStatus = "Completed";
      milestone.paymentDate = new Date(); 
    } else {
      return NextResponse.json({ message: "Invalid status provided." }, { status: 400 });
    }

    await project.save();

    return NextResponse.json(
      { message: "Milestone updated successfully.", milestone },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating milestone:", error.message);
    return NextResponse.json(
      { message: "Error updating milestone.", error: error.message },
      { status: 500 }
    );
  }
}
