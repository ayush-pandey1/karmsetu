import { ChatModel } from '../../(models)/ChatModel'; 
import connectToDatabase from '../../../lib/db'; 

export async function POST(req) {
  await connectToDatabase(); 
  
  try {
    const { senderId, receiverId } = await req.json();
    console.log("Received senderId:", senderId);
    console.log("Received receiverId:", receiverId);

    if (!senderId || !receiverId) {
      return new Response(JSON.stringify({ message: 'Both senderId and receiverId are required' }), { status: 400 });
    }

    
    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return new Response(JSON.stringify(existingChat), { status: 200 });
    }

    
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    const savedChat = await newChat.save();
    return new Response(JSON.stringify(savedChat), { status: 201 });
  } catch (err) {
    console.error("Error creating chat:", err);
    return new Response(JSON.stringify({ message: 'Failed to create chat', error: err.message }), { status: 500 });
  }
}
