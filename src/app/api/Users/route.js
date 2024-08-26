import User from "@/app/(models)/User";
// import User from "../../(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from 'cookie';

export async function POST(req) {
    try {
        const body = await req.json();
        const userData = body.data;

        if (!userData?.email || !userData?.password || !userData?.fullname) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }

        const duplicate = await User.findOne({ email: userData.email }).lean().exec();
        if (duplicate) {
            return NextResponse.json({ message: "Email is already used!!!" }, { status: 409 });
        }

        const hashPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashPassword;

        if (!userData.role) {
            userData.role = "client";
        }

        const newUser = await User.create(userData);

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, 
            path: '/',
            sameSite: 'Lax'
        };

        const cookieHeader = cookie.serialize('next-auth.session-token1', token, cookieOptions);

        return new NextResponse(JSON.stringify({
            message: "User created successfully!!",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                role: newUser.role
            }
        }), {
            status: 201,
            headers: {
                'Set-Cookie': cookieHeader,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
