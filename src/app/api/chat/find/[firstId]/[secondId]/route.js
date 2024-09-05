import { ChatModel } from '@/app/(models)/ChatModel'; 
import connectToDatabase from '@/lib/db'; 

export async function GET(req, { params }) {
  await connectToDatabase(); 

  const { firstId, secondId } = params; 

  console.log("Parameters received:", { firstId, secondId }); 

  try {
    
    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    console.log("Chat found:", chat); 

    if (chat) {
      return new Response(JSON.stringify(chat), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Chat not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error finding chat:", error);
    return new Response(JSON.stringify({ message: "Failed to find chat", error: error.message }), { status: 500 });
  }
}
