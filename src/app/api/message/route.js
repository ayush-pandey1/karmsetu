import MessageModel from "@/app/(models)/MessageModel";
import connectToDatabase from "@/lib/db";

export async function POST(req) {
  await connectToDatabase(); 
  
  try {
    const { chatId, senderId, text } = await req.json(); 
    console.log("Received chatId:", chatId);
    console.log("Received senderId:", senderId);
    console.log("Received text:", text);

    if (!chatId || !senderId || !text) {
      return new Response(JSON.stringify({ message: 'chatId, senderId, and text are required' }), { status: 400 });
    }

    
    const message = new MessageModel({
      chatId,
      senderId,
      text
    });

    const savedMessage = await message.save();
    return new Response(JSON.stringify(savedMessage), { status: 200 });
  } catch (err) {
    console.error("Error adding message:", err);
    return new Response(JSON.stringify({ message: 'Failed to add message', error: err.message }), { status: 500 });
  }
}
