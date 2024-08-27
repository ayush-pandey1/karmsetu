import User from "@/app/(models)/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const userData = body.data;

        if (!userData?.email) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }

        const user = await User.findOne({ email: userData.email }).lean().exec();

        return new NextResponse(JSON.stringify({
            message: "User data successfully retrieved",
            user
        }), {
            status: 200, 
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
