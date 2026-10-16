import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducerName = 'toast';
const initialState = {
  open: false,
  message: '',
  variant: 'info',
  isAuthenticated: false,
  isLoading: false,
  userProfile: null,
  rolePermission: [],
};

const toastSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setToastData: (state, action) => ({
      ...state,
      open: true,
      message: action.payload.message || 'Notification',
      variant: action.payload.variant || 'info',
    }),
    resetToastData: (state) => ({
      ...state,
      open: false,
      message: '',
      variant: 'info',
    }),
    setIsAuthenticated: (state, action) => ({
      ...state,
      isAuthenticated: action.payload,
    }),
    setIsLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    setProfileData: (state, action) => ({
      ...state,
      isAuthenticated: !!action.payload,
      userProfile: action.payload ? { ...action.payload } : null,
      rolePermission: action.payload?.permissions || [],
    }),
    resetProfileData: () => ({
      ...initialState,
    }),
    setRolePermission: (state, action) => ({
      ...state,
      rolePermission: action.payload || [],
    }),
  },
});

export const toastActions = toastSlice.actions;
export const toastReducers = persistReducer(
  {
    key: reducerName,
    storage,
    whitelist: ['isAuthenticated', 'userProfile', 'rolePermission'],
  },
  toastSlice.reducer
);
