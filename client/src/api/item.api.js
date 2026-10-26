import api from './client';

export const getItems = async (params) => {
  // params can include page, limit, search, category, etc.
  const response = await api.get('/items', { params });
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};