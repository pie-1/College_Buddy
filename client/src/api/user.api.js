import api from './client';

export const getUserProfile = async (userId) => {
  // If no userId provided, fetch the logged-in user's profile
  const endpoint = userId ? `/users/${userId}` : '/users/me';
  const response = await api.get(endpoint);
  return response.data;
};

export const updateMyProfile = async (userData) => {
  const response = await api.patch('/users/me', userData);
  return response.data;
};