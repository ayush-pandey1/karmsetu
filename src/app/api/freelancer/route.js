import User from "@/app/(models)/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch users with role 'freelancer' and exclude the 'password' field
        const freelancers = await User.find({ role: "freelancer" }, { password: 0 }).lean().exec();

        return NextResponse.json({
            message: "Freelancer data successfully retrieved",
            freelancers
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Error retrieving freelancer data:", error.message);
        return NextResponse.json({
            message: "Error retrieving freelancer data",
            error: error.message
        }, { status: 500 });
    }
}
