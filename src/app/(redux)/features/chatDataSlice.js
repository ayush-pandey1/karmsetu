import { createSlice } from "@reduxjs/toolkit";

const chatDataSlice = createSlice({
  name: "chatData",
  initialState: {
    userData: null,
    currentChat: null,
    messages: [], 
    sendMessage: null, 
    receiveMessage: null, 
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setSendMessage: (state, action) => {
      state.sendMessage = action.payload; 
    },
    sendMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
    setReceiveMessage: (state, action) => {
      state.receiveMessage = action.payload; 
      state.messages.push(action.payload); 
    },
  },
});

export const { setUserData, setCurrentChat, setSendMessage, sendMessage, setReceiveMessage } = chatDataSlice.actions;
export default chatDataSlice.reducer;
