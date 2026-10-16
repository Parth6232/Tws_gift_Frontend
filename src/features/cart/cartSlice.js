import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  items: [],
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item._id === product._id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
        if (product.personalizationNote) {
          existing.personalizationNote = product.personalizationNote;
        }
      } else {
        state.items.push({
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          image: product.image || product.images?.[0]?.url || null,
          category: product.category,
          quantity: product.quantity || 1,
          personalizationNote: product.personalizationNote || '',
        });
      }
      state.isDrawerOpen = true; // Auto open drawer on add
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    updatePersonalizationNote: (state, action) => {
      const { id, note } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.personalizationNote = note;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setCartDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;
export const cartReducer = persistReducer(
  {
    key: 'cart',
    storage,
    whitelist: ['items'],
  },
  cartSlice.reducer
);
