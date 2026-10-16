import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootReducers from './redux/rootReducer';

import { authApiAction } from '../features/auth/authApiSlice';
import { commonApiAction } from './redux/slices/commonApiSlice';
import { productApiAction } from '../features/product/productApiSlice';
import { productManagementApiAction } from '../features/productManagement/productManagementApiSlice';
import { categoryApiAction } from '../features/categoryManagement/categoryApiSlice';
import { dashboardApiAction } from '../features/dashboard/dashboardApiSlice';
import { userAndPermissionApiAction } from '../features/userAndPermission/userAndPermissionApiSlice';
import { chatApiAction } from '../features/chatbot/chatApiSlice';

export const reduxStore = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([
      authApiAction.middleware,
      commonApiAction.middleware,
      productApiAction.middleware,
      productManagementApiAction.middleware,
      categoryApiAction.middleware,
      dashboardApiAction.middleware,
      userAndPermissionApiAction.middleware,
      chatApiAction.middleware,
    ]),
});

export const persistor = persistStore(reduxStore);
