import MessageModel from "@/app/(models)/MessageModel";
import connectToDatabase from "@/lib/db";
import { z } from "zod";
import { safeTrimmedString } from "@/validations/common";
import { validateRequestBody } from "@/validations/middleware";
import { NextResponse } from "next/server";

const messageSchema = z.object({
  chatId: safeTrimmedString(1, 100, "chatId"),
  senderId: safeTrimmedString(1, 100, "senderId"),
  text: safeTrimmedString(1, 5000, "Message text"),
});

export async function POST(req) {
  await connectToDatabase(); 
  
  try {
    const body = await req.json(); 
    const validation = validateRequestBody(messageSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { chatId, senderId, text } = validation.data;

    const message = new MessageModel({
      chatId,
      senderId,
      text
    });

    const savedMessage = await message.save();
    return NextResponse.json(savedMessage, { status: 200 });
  } catch (err) {
    console.error("Error adding message:", err);
    return NextResponse.json({ message: 'Failed to add message', error: err.message }, { status: 500 });
  }
}

