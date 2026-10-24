import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const setupSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: No token'));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.id})`);

    // Join a specific conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Handle sending a message in real-time
    socket.on('send-message', async (data) => {
      try {
        let { conversationId, receiverId, text } = data;

        // Create conversation if it's new
        if (conversationId === 'new') {
          let conv = await Conversation.findOne({
            participants: { $all: [socket.userId, receiverId] },
            isActive: true,
          });
          if (!conv) {
            conv = await Conversation.create({ participants: [socket.userId, receiverId] });
          }
          conversationId = conv._id;
        }
        // 1. Save to database
        const newMessage = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          receiver: receiverId,
          message: text,
        });

        // 2. Update the conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: newMessage._id,
          lastMessageAt: new Date(),
        });

        // 3. Populate sender info
        const populatedMessage = await newMessage.populate([
          { path: 'sender', select: 'name profileImage' },
          { path: 'receiver', select: 'name profileImage' }
        ]);

        // 4. Emit to the room
        io.to(`conversation:${conversationId}`).emit('new-message', populatedMessage);
      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};