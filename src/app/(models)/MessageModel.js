const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  chatId: { type: String },
  senderId: { type: String},
  text: { type: String },
}, {
  timestamps: true,
});


const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
