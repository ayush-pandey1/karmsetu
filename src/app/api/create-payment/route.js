import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    let amountInRupees = 100;
    try {
      const body = await req.json();
      if (body && body.amount && !isNaN(Number(body.amount))) {
        amountInRupees = Number(body.amount);
      }
    } catch (_) {
      // Body not supplied or not json
    }

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

