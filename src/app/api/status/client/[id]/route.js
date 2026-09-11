import Project from "@/app/(models)/project"; 
import { NextResponse } from "next/server";
import { clientMilestoneReviewSchema } from "@/validations/project";
import { validateRequestBody } from "@/validations/middleware";

export async function PATCH(req, { params }) {
  try {
    const { id } = params; 
    const body = await req.json(); 

    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    const validation = validateRequestBody(clientMilestoneReviewSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { milestoneId, status } = validation.data;

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const milestone = project.milestones.find(
      (m) => m._id.toString() === milestoneId
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

