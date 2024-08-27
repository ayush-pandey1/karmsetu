import User from "@/app/(models)/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params; 

        if (!id) {
            return NextResponse.json({ message: "ID is required." }, { status: 400 });
        }

        const user = await User.findById(id).lean().exec();

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        return NextResponse.json({
            message: "User data successfully retrieved",
            user
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Error retrieving user data:", error);
        return NextResponse.json({
            message: "Error retrieving user data",
            error: error.message
        }, { status: 500 });
    }
}
