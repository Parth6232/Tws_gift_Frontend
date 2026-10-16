import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  messages: [
    {
      role: 'assistant',
      content:
        'Hello! I am the TWS Gifts shopping assistant. Looking for a personalized or corporate gift idea? Ask me anything!',
      products: [],
      timestamp: new Date().toISOString(),
    },
  ],
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setChatOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearMessages: (state) => {
      state.messages = [initialState.messages[0]];
    },
  },
});

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
