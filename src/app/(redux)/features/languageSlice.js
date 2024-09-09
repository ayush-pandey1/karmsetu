// /features/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import en from '../../language/en.json';
import hi from '../../language/hi.json';

const translations = {
  en,
  hi,
};

const initialState = {
  language: 'en',
  messages: translations['en'],
};

// /features/languageSlice.js
const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
      setLanguage: (state, action) => {
        const selectedLanguage = action.payload;
        console.log('Setting language to:', selectedLanguage);
        state.language = selectedLanguage;
        state.messages = translations[selectedLanguage] || translations['en'];
        console.log('Messages updated:', state.messages);
      },
    },
  });
  

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
