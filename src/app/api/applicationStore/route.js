import Application from "@/app/(models)/application";
import { NextResponse } from "next/server";
import Project from "@/app/(models)/project";
import { connect } from "@/config/db";

connect();

export async function POST(req) {
    try {
        const body = await req.json();

        // Extract the necessary fields from the request body
        const { clientId, message, freelancer, project } = body;

        // Validate required fields
        if (!clientId || !freelancer || !project) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create a new Application document
        const newApplication = new Application({
            clientId,
            message,
            freelancer: {
                id:freelancer._id,
                fullname: freelancer.fullname,
                email: freelancer.email,
                phone: freelancer.phone,
                professionalTitle: freelancer.professionalTitle,
                skill: freelancer.skill
            },
            project: {
                id:project._id,
                title: project.title,
                description: project.description,
                budget: project.budget,
                status: project.status
            }
        });

        const projectData = await Project.findOneAndUpdate(
            {_id : project._id},
            {$addToSet : {applied : [freelancer._id]}},
            { new: true }                             // Return the updated document
        );

        console.log(projectData, "After updating applied applied array in project")

        // Save the application to the database
        await newApplication.save();

        // Return success response
        return NextResponse.json({ success: true, application: newApplication }, { status: 201 });

    } catch (error) {
        console.error('Error saving application:', error);
        return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }
}
