import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";
import Application from "@/app/(models)/application";
import {sendEmail} from "@/utils/applicationStatusEmail"
import axios from 'axios';

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
    const freelancerName = project.freelancerName ? project.freelancerName : "Ayush";
    const clientName = project.clientName;
    const projectName = project.title;

    // console.log(project, "Project Details from applicationAccepted API")
    // console.log("Freelancer Name from applicationAccepted API", freelancerName);

    // const freelancerDetails = await axios.get(`/api/user?id=${freelancerId}`)
    // const freelancerEmail = freelancerDetails.email;

    if (!project) {
      console.log("Project not found");
      return NextResponse.json(
        { message: "Project not found." },
        { newStatus: 404 }
      );
    }
    console.log("Project found");

    const updateApplicationStatus = async (newStatus)=>{
      console.log(newStatus, freelancerId, id, "Inside the updateApplicationStatus function in the API");
      const application = await Application.findOneAndUpdate(
        {
        "freelancer.id": freelancerId,
        "project.id": id
      },
      {$set : {applicationStatus : newStatus}},
      {new : true}
    );
      
      if (!application) {
        return NextResponse.json(
          { message: "Application not found." },
          { newStatus: 404 }
        );
      }
    };
    
    if (newStatus === 'accepted') {
      console.log("Application newStatus to be updated to Accepted");
      //Update the freelancerId and set the newStatus to "In Progress"
      console.log(freelancerId, "If Status is accepted in the Backend");
      project.freelancerId = freelancerId;
      project.newStatus = "In Progress";
      console.log("Updated Project Status, and freelancerId when newStatus is accepted")
      // Save the updated project
      await project.save();
      console.log(newStatus, "if the application newStatus is accepted and after saving the changes in the project document");
      await updateApplicationStatus(newStatus);
      //const mail = await applicationStatusEmail(freelancerEmail, newStatus, freelancerName, clientName, projectName);
      return NextResponse.json(
        {
          message: "Freelancer assigned, project newStatus updated to In Progress, and Updated Application Status.",
          project, success: true
        },
        { newStatus: 200 }
      );
    }else if(newStatus === 'rejected'){
      const freelancerEmail = "lakshay12290@gmail.com";
      console.log(newStatus);
      console.log("Application newStatus to be updated to Rejected");
      await updateApplicationStatus(newStatus);
      const mail = await sendEmail(freelancerEmail, newStatus, freelancerName, clientName, projectName);
      console.log(mail, "REsponse of sending mail");
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
