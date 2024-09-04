import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  members: [String], 
}, {
    timestamps: true,
  });

const ChatModel = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
export { ChatModel };
