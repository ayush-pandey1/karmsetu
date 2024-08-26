import { connect } from "../../../../config/db";
import ProjectSchema from "../../../(models)/project";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(NextRequest) {
  try {
    const reqBody = await NextRequest.json();
    const { values, tags } = reqBody;
    const { description, budget, projectCategory, duration, title } = values;

    // Convert tags to an array of strings
    const tagTexts = tags.map(tag => tag.text);


    const newProject = new ProjectSchema({
      title,
      description,
      budget,
      technologies: tagTexts,
      duration,
      projectCategory
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
    const status = NextRequest.nextUrl.searchParams.get('status');

    // If status is provided, filter by status; otherwise, fetch all data
    const query = status ? { status } : {};

    // Fetch data from MongoDB based on the query
    const data = await ProjectSchema.find(query);

    // Return the response with the fetched data
    return NextResponse.json({ message: "Fetched Data Successfully", success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}