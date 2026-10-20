import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { appConstants } from '../../constant/appConstants';

const MIN_QTY = appConstants.minOrderQty || 1;

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
      const addQty = Math.max(MIN_QTY, product.quantity || MIN_QTY);
      const existing = state.items.find((item) => item._id === product._id);
      if (existing) {
        existing.quantity = Math.max(MIN_QTY, existing.quantity || MIN_QTY) + addQty;
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
          quantity: addQty,
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
      if (item && quantity >= MIN_QTY) {
        item.quantity = quantity;
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
    migrate: (state) => {
      if (!state) return Promise.resolve(state);
      const items = Array.isArray(state.items)
        ? state.items.map((i) => ({
            ...i,
            quantity: Math.max(MIN_QTY, i.quantity || MIN_QTY),
          }))
        : [];
      return Promise.resolve({
        ...state,
        items,
      });
    },
  },
  cartSlice.reducer
);
