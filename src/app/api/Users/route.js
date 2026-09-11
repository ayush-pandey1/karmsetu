import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signupSchema } from "@/validations/auth";
import { validateRequestBody } from "@/validations/middleware";

export async function POST(req) {
    try {
        const body = await req.json();
        const userData = body?.data || body;

        const validation = validateRequestBody(signupSchema, userData);
        if (!validation.success) {
            return validation.response;
        }

        const validData = validation.data;
        const normalizedEmail = validData.email.toLowerCase().trim();

        const duplicate = await User.findOne({ email: normalizedEmail }).lean().exec();
        if (duplicate) {
            return NextResponse.json({ message: "Email is already used!!!" }, { status: 409 });
        }

        const hashPassword = await bcrypt.hash(validData.password, 10);
        const fullname = validData.fullname || `${validData.firstName} ${validData.lastName}`.trim();

        const newUser = await User.create({
            fullname,
            email: normalizedEmail,
            password: hashPassword,
            role: validData.role,
        });

        return NextResponse.json({
            message: "User created successfully!!",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                role: newUser.role
            }
        }, {
            status: 201
        });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

