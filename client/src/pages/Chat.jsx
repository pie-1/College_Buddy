import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../lib/socket';
import { getConversations, getMessages } from '../api/chat.api';
import { Send } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 1. Connect socket on mount
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  // 2. Fetch initial conversations
  useEffect(() => {
    getConversations().then(setConversations).catch(console.error);
  }, []);

  // 3. Listen for incoming messages
  useEffect(() => {
    socket.on('new-message', (msg) => {
      // Add message if it belongs to the active chat
      if (activeChat && (msg.sender._id === activeChat._id || msg.receiver._id === activeChat._id)) {
        setMessages((prev) => [...prev, msg]);
      }
      // Update conversation list preview (optional)
      getConversations().then(setConversations);
    });

    return () => socket.off('new-message');
  }, [activeChat]);

  // 4. Open a chat
  const openChat = async (otherUser) => {
    setActiveChat(otherUser);
    try {
      const history = await getMessages(otherUser._id);
      setMessages(history);
      
      // Join the socket room for this conversation
      if (history.length > 0) {
        socket.emit('join-conversation', history[0].conversation);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    socket.emit('send-message', {
      conversationId: messages[0]?.conversation || 'new', // Need backend logic to handle 'new' if empty
      receiverId: activeChat._id,
      text: newMessage
    });
    setNewMessage('');
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      
      {/* Sidebar: Conversations */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b bg-gray-50 font-bold text-lg">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find(p => p._id !== user._id);
            return (
              <div 
                key={conv._id} 
                onClick={() => openChat(otherUser)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeChat?._id === otherUser._id ? 'bg-blue-50' : ''}`}
              >
                <div className="font-semibold">{otherUser.name}</div>
                <div className="text-sm text-gray-500 truncate">{conv.lastMessage?.message || 'No messages yet'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b bg-gray-50 font-semibold">{activeChat.name}</div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, idx) => {
                const isMe = msg.sender._id === user._id;
                return (
                  <div key={idx} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;