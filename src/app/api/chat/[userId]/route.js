import { ChatModel } from '../../../(models)/ChatModel'; 
import connectToDatabase from '../../../../lib/db'; 

export async function GET(req, { params }) {
  await connectToDatabase(); 

  const { userId } = params; 

  try {
    const chats = await ChatModel.find({
      members: { $in: [userId] },
    });

    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch chats", error: error.message }), { status: 500 });
  }
}
