import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

/**
 * Message Controller
 * Handles messaging between users
 */

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { receiver, message, conversationId } = req.body;
    const sender = req.userId;

    let conversation = null;
    let newConversation = false;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      // Find existing conversation or create new
      conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
        isActive: true,
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [sender, receiver],
        });
        newConversation = true;
      }
    }

    const newMessage = await Message.create({
      conversation: conversation._id,
      sender,
      receiver,
      message,
    });

    // Update conversation
    conversation.lastMessage = newMessage._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Populate for response
    await newMessage.populate('sender', 'name profileImage');
    await newMessage.populate('receiver', 'name profileImage');

    res.status(201).json({
      message: newMessage,
      conversationId: conversation._id,
      isNew: newConversation,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
      isActive: true,
    })
      .populate('participants', 'name email profileImage')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get messages
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [req.userId, userId] },
    });

    if (!conversation) {
      return res.json([]);
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.updateMany(
      { conversation: id, receiver: req.userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.userId,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: error.message });
  }
};