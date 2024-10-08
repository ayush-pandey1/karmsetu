import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
