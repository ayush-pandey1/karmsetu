import User from "@/app/(models)/User";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// mongoose.connect(process.env.MONGO_URL);
// mongoose.Promise = global.Promise;

export async function GET() {
    await connectToDatabase();
    try {
        
        const freelancers = await User.find({ role: "freelancer" }).lean().exec();

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
