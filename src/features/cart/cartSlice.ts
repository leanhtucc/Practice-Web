import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../products/productTypes";
import { CartState, UpdateQuantityPayload } from "./cartTypes";

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<UpdateQuantityPayload>
    ) {
      const { id, quantity } = action.payload;

      if (!Number.isSafeInteger(quantity)) {
        return;
      }
      const existing = state.items.find(
        (item) => item.product.id === id
      );

      if (!existing) {
        return;
      }

      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.product.id !== id
        );
      } else {
        existing.quantity = quantity;
      }
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
} = cartSlice.actions;

export const updateQuatity = updateQuantity;

export default cartSlice.reducer;