import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item._id === product._id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          image: product.image || product.images?.[0]?.url || null,
          category: product.category,
          soldOut: product.soldOut,
        });
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export const wishlistReducer = persistReducer(
  {
    key: 'wishlist',
    storage,
    whitelist: ['items'],
  },
  wishlistSlice.reducer
);
