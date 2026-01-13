import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return null;
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const defaultState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
};

// Use saved cart or default state
const initialState = loadCartFromStorage() || defaultState;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product) => product._id === action.payload._id
      );
      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
      }
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const products = state.products.map((product) => {
        if (product._id === action.payload.id) {
          if (action.payload.type === "increment") {
            product.quantity += 1;
          } else if (action.payload.type === "decrement") {
            if (product.quantity > 1) {
              product.quantity -= 1;
            }
          }
        }
        return product;
      });
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
      saveCartToStorage(state);
    },
  },
});

export const selectSelectedItems = (state) =>
  state.products.reduce((total, product) => {
    return Number(total + product.quantity);
  }, 0);

export const selectTotalPrice = (state) =>
  state.products.reduce((total, product) => {
    return Number(total + product.quantity * product.price);
  }, 0);

export const selectTax = (state) => selectTotalPrice(state) * state.taxRate;

export const selectGrandTotal = (state) => {
  return selectTotalPrice(state) + selectTotalPrice(state) * state.taxRate;
};
export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
