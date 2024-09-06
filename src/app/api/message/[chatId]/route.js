import MessageModel from "@/app/(models)/MessageModel";
import connectToDatabase from "@/lib/db";

export async function GET(req, { params }) {
  await connectToDatabase(); 

  try {
    const { chatId } = params; 
    console.log("Received chatId:", chatId);

    if (!chatId) {
      return new Response(JSON.stringify({ message: 'chatId is required' }), { status: 400 });
    }

    const messages = await MessageModel.find({ chatId });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return new Response(JSON.stringify({ message: 'Failed to fetch messages', error: err.message }), { status: 500 });
  }
}
