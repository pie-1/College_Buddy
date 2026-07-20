import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    type: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);


const Message = mongoose.model('Message', messageSchema);
export default Message;