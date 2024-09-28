import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";
import Application from "@/app/(models)/application";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { freelancerId, newStatus } = await req.json();

    if (!id || !freelancerId) {
      return NextResponse.json(
        { message: "Project ID and Freelancer ID are required." },
        { newStatus: 400 }
      );
    }
    console.log("FreelancerId, id received in the backend");
    console.log(freelancerId, id, newStatus, "From Backend API which would update the application newStatus");

    const project = await Project.findById(id);

    // const freelancerDetails = await axios.get(`/api/user?id=${freelancerId}`)
    // const freelancerEmail = freelancerDetails.email;

    if (!project) {
      console.log("Project not found");
      return NextResponse.json(
        { message: "Project not found." },
        { newStatus: 404 }
      );
    }


    const updateApplicationStatus = async (newStatus) => {
      console.log(newStatus, freelancerId, id, "Inside the updateApplicationStatus function in the API");
      const application = await Application.findOneAndUpdate(
        {
          "freelancer.id": freelancerId,
          "project.id": id
        },
        { $set: { applicationStatus: newStatus } },
        { new: true }
      );
      if (newStatus === 'accepted') {
        // Find and reject all other pending applications for the project
        await Application.updateMany(
          { id, status: 'pending', freelancerId: { $ne: freelancerId } },
          { status: 'rejected' }
        );
      }



      if (!application) {
        return NextResponse.json(
          { message: "Application not found." },
          { newStatus: 404 }
        );
      }
    };

    if (project.freelancerId!=="none") {
      await updateApplicationStatus("rejected");
      throw new Error('A freelancer has already been accepted for this project.');
    }
    console.log("Project found");

    // const freelancerName = project.freelancerName ? project.freelancerName : "Ayush";
    // const clientName = project.clientName;
    // const projectName = project.title;


    if (newStatus === 'accepted') {
      console.log("Application newStatus to be updated to Accepted");
      //Update the freelancerId and set the newStatus to "In Progress"
      console.log(freelancerId, "If Status is accepted in the Backend");
      project.freelancerId = freelancerId;
      project.status = "In Progress";
      console.log("Updated Project Status, and freelancerId when newStatus is accepted")
      // Save the updated project
      await project.save();
      console.log(newStatus, "if the application newStatus is accepted and after saving the changes in the project document");
      await updateApplicationStatus(newStatus);
      return NextResponse.json(
        {
          message: "Freelancer assigned, project newStatus updated to In Progress, and Updated Application Status.",
          project, success: true
        },
        { newStatus: 200 }
      );
    } else if (newStatus === 'rejected') {
      const freelancerEmail = "lakshay12290@gmail.com";
      console.log(newStatus);
      console.log("Application newStatus to be updated to Rejected");
      await updateApplicationStatus(newStatus);
      return NextResponse.json(
        {
          message: "Updated Application Status.",
          project, success: true
        },
        { newStatus: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating project:", error.message);
    return NextResponse.json(
      {
        message: "Error updating project.",
        error: error.message,
      },
      { newStatus: 500 }
    );
  }
}
