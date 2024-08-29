import { connect } from "../../../../config/db";
import ProjectSchema from "../../../(models)/project";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(NextRequest) {
  try {
    const reqBody = await NextRequest.json();
    const { values, tags , clientName} = reqBody;
    const { description, budget, projectCategory, duration, title,clientId  } = values;

    // Convert tags to an array of strings
    const tagTexts = tags.map(tag => tag.text);


    const newProject = new ProjectSchema({
      title,
      description,
      budget,
      technologies: tagTexts,
      duration,
      projectCategory,
      clientId,
      clientName
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

    // Fetch data from MongoDB based on the query
    const data = await ProjectSchema.find({clientId});
    if(data.length == 0){
      return NextResponse.json({ message: "No Projects", success: true, empty : true}, { status: 200 });  
    }
    // Return the response with the fetched data
    return NextResponse.json({ message: "Fetched Data Successfully", success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}
