import api from './client';

export const getConversations = async () => {
  const res = await api.get('/messages/conversations');
  return res.data;
};

export const getMessages = async (userId) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data;
};

export const markAsRead = async (conversationId) => {
  await api.put(`/messages/${conversationId}/read`);
};