import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";
import Application from "@/app/(models)/application";
import { connect } from "@/config/db";

connect();

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { freelancerId, newStatus } = body;

    if (!id || !freelancerId) {
      return NextResponse.json(
        { message: "Project ID and Freelancer ID are required." },
        { status: 400 }
      );
    }

    const normalizedStatus =
      (newStatus || "").toLowerCase() === "accepted" ? "Accepted" : "Rejected";

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    // Check if project already has another freelancer assigned
    if (
      normalizedStatus === "Accepted" &&
      project.freelancerId &&
      project.freelancerId !== "none" &&
      project.freelancerId !== freelancerId
    ) {
      return NextResponse.json(
        { message: "A freelancer has already been assigned to this project." },
        { status: 400 }
      );
    }

    // Update target application status
    const updatedApplication = await Application.findOneAndUpdate(
      {
        "freelancer.id": freelancerId,
        "project.id": id,
      },
      { $set: { applicationStatus: normalizedStatus } },
      { new: true }
    );

    if (normalizedStatus === "Accepted") {
      // Reject other pending applications for this project
      await Application.updateMany(
        {
          "project.id": id,
          applicationStatus: { $in: ["Pending", "pending"] },
          "freelancer.id": { $ne: freelancerId },
        },
        { $set: { applicationStatus: "Rejected" } }
      );

      // Update project freelancer and status
      project.freelancerId = freelancerId;
      project.status = "In Progress";
      await project.save();

      return NextResponse.json(
        {
          message: "Freelancer accepted and assigned to project.",
          success: true,
          project,
          application: updatedApplication,
          status: normalizedStatus,
        },
        { status: 200 }
      );
    } else {
      // Remove freelancer from project.applied array upon rejection so they can reapply if desired
      await Project.findByIdAndUpdate(id, {
        $pull: { applied: freelancerId },
      });

      return NextResponse.json(
        {
          message: "Application rejected.",
          success: true,
          project,
          application: updatedApplication,
          status: normalizedStatus,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      {
        message: "Error updating application status.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

