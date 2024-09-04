import { configureStore } from '@reduxjs/toolkit';
import projectDataReducer from '../features/projectDataSlice';
import freelancerProjects from '../features/freelancerProjects';
import chatDataReducer from '../features/chatDataSlice'; 
import socketReducer from "../features/socketSlice";

const store = configureStore({
  reducer: {
    projects: projectDataReducer,
    freelancer: freelancerProjects,
    chatData: chatDataReducer,
    socket: socketReducer,     
  },
});

export default store;
