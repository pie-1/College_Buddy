import api from './client';

// Create item (multipart for images)
export const createItem = async (formData) => {
  const { data } = await api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Get single item
export const getItem = async (id) => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

// Get all items (with pagination)
export const getItems = async (params = {}) => {
  const { data } = await api.get('/items', { params });
  return data;
};