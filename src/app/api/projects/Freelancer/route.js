import { connect } from "../../../../config/db";
import ProjectSchema from "../../../(models)/project";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(NextRequest) {
    try {
      const freelancerId = NextRequest.nextUrl.searchParams.get('freelancerId');
  
      // Fetch data from MongoDB based on the query
      const data = await ProjectSchema.find({freelancerId});
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