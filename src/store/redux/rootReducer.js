import { combineReducers } from 'redux';
import { toastReducers } from './slices/toastSlice';
import { themeReducers } from './slices/themeSlice';
import { cartReducer } from '../../features/cart/cartSlice';
import { wishlistReducer } from '../../features/wishlist/wishlistSlice';
import { chatReducer } from '../../features/chatbot/chatSlice';

import { authApiAction, authApiReducer } from '../../features/auth/authApiSlice';
import { commonApiAction, commonApiReducer } from './slices/commonApiSlice';
import { productApiAction, productApiReducer } from '../../features/product/productApiSlice';
import {
  productManagementApiAction,
  productManagementApiReducer,
} from '../../features/productManagement/productManagementApiSlice';
import {
  categoryApiAction,
  categoryApiReducer,
} from '../../features/categoryManagement/categoryApiSlice';
import {
  dashboardApiAction,
  dashboardApiReducer,
} from '../../features/dashboard/dashboardApiSlice';
import {
  userAndPermissionApiAction,
  userAndPermissionApiReducer,
} from '../../features/userAndPermission/userAndPermissionApiSlice';
import { chatApiAction, chatApiReducer } from '../../features/chatbot/chatApiSlice';

const rootReducers = combineReducers({
  toast: toastReducers,
  theme: themeReducers,
  cart: cartReducer,
  wishlist: wishlistReducer,
  chat: chatReducer,

  [authApiAction.reducerPath]: authApiReducer,
  [commonApiAction.reducerPath]: commonApiReducer,
  [productApiAction.reducerPath]: productApiReducer,
  [productManagementApiAction.reducerPath]: productManagementApiReducer,
  [categoryApiAction.reducerPath]: categoryApiReducer,
  [dashboardApiAction.reducerPath]: dashboardApiReducer,
  [userAndPermissionApiAction.reducerPath]: userAndPermissionApiReducer,
  [chatApiAction.reducerPath]: chatApiReducer,
});

export default rootReducers;
