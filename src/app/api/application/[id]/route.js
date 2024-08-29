import Application from "@/app/(models)/application";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ message: "Client ID is required." }, { status: 400 });
        }

        // Find all applications with the given clientId
        const applications = await Application.find({ clientId: id }).lean().exec();

        if (applications.length === 0) {
            return NextResponse.json({ message: "No applications found for this client." }, { status: 404 });
        }

        return NextResponse.json({
            message: "Applications data successfully retrieved",
            applications
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Error retrieving application data:", error.message);
        return NextResponse.json({
            message: "Error retrieving application data",
            error: error.message
        }, { status: 500 });
    }
}
