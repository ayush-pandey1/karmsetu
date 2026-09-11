import { ChatModel } from '../../(models)/ChatModel'; 
import connectToDatabase from '../../../lib/db'; 
import { z } from "zod";
import { safeTrimmedString } from "@/validations/common";
import { validateRequestBody } from "@/validations/middleware";
import { NextResponse } from "next/server";

const createChatSchema = z.object({
  senderId: safeTrimmedString(1, 100, "senderId"),
  receiverId: safeTrimmedString(1, 100, "receiverId"),
});

export async function POST(req) {
  await connectToDatabase(); 
  
  try {
    const body = await req.json();
    const validation = validateRequestBody(createChatSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { senderId, receiverId } = validation.data;

    if (senderId === receiverId) {
      return NextResponse.json({ message: "Cannot create chat with self" }, { status: 400 });
    }

    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return NextResponse.json(existingChat, { status: 200 });
    }

    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    const savedChat = await newChat.save();
    return NextResponse.json(savedChat, { status: 201 });
  } catch (err) {
    console.error("Error creating chat:", err);
    return NextResponse.json({ message: 'Failed to create chat', error: err.message }, { status: 500 });
  }
}

