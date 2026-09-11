import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { moneySchema } from "@/validations/common";
import { validateRequestBody } from "@/validations/middleware";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentSchema = z.object({
  amount: moneySchema,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = validateRequestBody(paymentSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const amountInRupees = validation.data.amount;

    const order = await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100), // amount in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({
      orderId: order.id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order: ", error);
    return NextResponse.json(
      { error: error.message || "Error creating order" },
      { status: 500 }
    );
  }
}


