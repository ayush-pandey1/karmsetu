// import Pro from "@/app/(models)/Project";
import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;  

        let projects;
        
        if (id === "all") {
            projects = await Project.find({ status: "Pending" }).lean().exec(); 

            if (!projects || projects.length === 0) {
                return NextResponse.json({ message: "No pending projects found." }, { status: 404 });
            }

            return NextResponse.json({
                message: "Pending projects successfully retrieved",
                projects  
            }, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const project = await Project.findById(id).lean().exec();  

        if (!project) {
            return NextResponse.json({ message: "Project not found." }, { status: 404 });
        }

        return NextResponse.json({
            message: "Project data successfully retrieved",
            project
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Error retrieving project data:", error.message);
        return NextResponse.json({
            message: "Error retrieving project data",
            error: error.message
        }, { status: 500 });
    }
}
