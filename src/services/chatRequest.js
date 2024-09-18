import axios from 'axios';

const API = axios.create({
  baseURL: 'https://karmsetu.vercel.app/api',
});

export const userChats = (id) => API.get(`/chat/${id}`);
export const getUser = (userId) => API.get(`/user/${userId}`);
export const getMessages = (id) => API.get(`/message/${id}`);
export const addMessage = (data) => API.post(`/message/`,data);
export const createChat = (senderId, receiverId) => {
  return API.post(`/chat`, {
    senderId,
    receiverId
  });
};
