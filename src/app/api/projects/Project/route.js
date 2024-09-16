import { connect } from "../../../../config/db";
import ProjectSchema from "../../../(models)/project";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(NextRequest) {
  try {
    const reqBody = await NextRequest.json();
    const { values, tags, clientName, coordinates, milestones, clientImageLink } = reqBody;
    const { description, budget, projectCategory, duration, title, clientId, } = values;

    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // Ensure milestones data is valid
    if (!Array.isArray(milestones)) {
      return NextResponse.json({ error: "Invalid milestones data" }, { status: 400 });
    }
    if (!freelancerDetails.clientImageLink) {
      freelancerDetails.clientImageLink = "";
    }
    freelancerDetails.clientImageLink = clientImageLink;

    // const tagTexts = tags.map(tag => tag.text);
    const tagTexts = values.skills;


    const newProject = new ProjectSchema({
      title,
      description,
      budget,
      technologies: tagTexts,
      duration,
      projectCategory,
      clientId,
      clientName,
      clientImageLink,
      coordinates: {
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude
      },
      milestones
    });


    const savedProject = await newProject.save();
    // console.log(savedProject);
    return NextResponse.json({ message: "Project created  successfully", success: true, savedProject }, { status: 201 });

  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });

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
