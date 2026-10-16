import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const getInitialMode = () => {
  if (typeof window !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialMode(),
  },
  reducers: {
    toggleTheme: (state) => {
      const nextMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = nextMode;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextMode);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(nextMode);
        document.documentElement.style.backgroundColor = nextMode === 'dark' ? '#1C1210' : '#FFF8EC';
      }
    },
    setThemeMode: (state, action) => {
      const mode = action.payload;
      state.mode = mode;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', mode);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(mode);
        document.documentElement.style.backgroundColor = mode === 'dark' ? '#1C1210' : '#FFF8EC';
      }
    },
  },
});

export const themeActions = themeSlice.actions;
export const themeReducers = persistReducer(
  {
    key: 'theme',
    storage,
    whitelist: ['mode'],
  },
  themeSlice.reducer
);
