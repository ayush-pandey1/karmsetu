import Application from "@/app/(models)/application";
import { NextResponse } from "next/server";
import Project from "@/app/(models)/project";
import { connect } from "@/config/db";

connect();

export async function POST(req) {
  try {
    const body = await req.json();
    const { clientId, message, freelancer, project } = body;

    if (!clientId || !freelancer || !project) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const freelancerId = freelancer._id || freelancer.id;
    const projectId = project._id || project.id;

    if (!freelancerId || !projectId) {
      return NextResponse.json({ error: "Invalid freelancer or project identifier" }, { status: 400 });
    }

    // Check if an application already exists for this freelancer and project
    const existingApplication = await Application.findOne({
      "freelancer.id": freelancerId,
      "project.id": projectId,
    });

    if (existingApplication) {
      const statusLower = (existingApplication.applicationStatus || "").toLowerCase();
      if (statusLower === "accepted") {
        return NextResponse.json(
          { error: "You are already accepted for this project." },
          { status: 400 }
        );
      }
      if (statusLower === "pending") {
        return NextResponse.json(
          { error: "You already have a pending application for this project." },
          { status: 400 }
        );
      }

      // If previously rejected, allow re-application by resetting status to Pending with new message
      existingApplication.message = message;
      existingApplication.applicationStatus = "Pending";
      existingApplication.freelancer = {
        id: freelancerId,
        fullname: freelancer.fullname || freelancer.name || "Freelancer",
        email: freelancer.email,
        phone: freelancer.phone || "",
        professionalTitle: freelancer.professionalTitle || "Freelancer",
        skill: freelancer.skill || [],
        imageLink: freelancer.imageLink || freelancer.profileImage || "",
      };
      existingApplication.project = {
        id: projectId,
        title: project.title,
        description: project.description || "",
        budget: project.budget || 0,
        status: project.status || "Pending",
      };

      await existingApplication.save();

      // Add freelancer back to project.applied
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { applied: freelancerId },
      });

      return NextResponse.json(
        { success: true, message: "Re-application submitted successfully", application: existingApplication },
        { status: 200 }
      );
    }

    // Create a new Application document
    const newApplication = new Application({
      clientId,
      message,
      applicationStatus: "Pending",
      freelancer: {
        id: freelancerId,
        fullname: freelancer.fullname || freelancer.name || "Freelancer",
        email: freelancer.email,
        phone: freelancer.phone || "",
        professionalTitle: freelancer.professionalTitle || "Freelancer",
        skill: freelancer.skill || [],
        imageLink: freelancer.imageLink || freelancer.profileImage || "",
      },
      project: {
        id: projectId,
        title: project.title,
        description: project.description || "",
        budget: project.budget || 0,
        status: project.status || "Pending",
      },
    });

    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { applied: freelancerId },
    });

    await newApplication.save();

    return NextResponse.json(
      { success: true, message: "Application submitted successfully", application: newApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json({ error: error.message || "Failed to save application" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const freelancerId = searchParams.get("freelancerId");

    if (!projectId || !freelancerId) {
      return NextResponse.json(
        { error: "projectId and freelancerId are required query parameters" },
        { status: 400 }
      );
    }

    const application = await Application.findOne({
      "project.id": projectId,
      "freelancer.id": freelancerId,
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch application" },
      { status: 500 }
    );
  }
}


