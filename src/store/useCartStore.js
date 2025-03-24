

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useCartStore = create((set) => ({
  cart: [],
  totalAmount:0,
  
  addToCart: async (productId) => {
    try {
      const response = await axiosInstance.post("/cart/add", {
        productId,
      });
      set((state) => ({
        cart: [...state.cart, response.data],
      }));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },
  fetchCart: async () => {
    try {
      const response = await axiosInstance.get("/cart");
      const cartItems = response.data;
      const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      set({ cart: cartItems, totalAmount: total });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      await axiosInstance.patch(`/cart/update/${cartItemId}`, { quantity });
      set((state) => ({
        cart: state.cart.map((item) =>
          item._id === cartItemId ? { ...item, quantity } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  },

  clearItem: async (cartItemId) => {
    try {
      await axiosInstance.delete(`/cart/delete/${cartItemId}`);
      set((state) => ({
        cart: state.cart.filter((item) => item._id !== cartItemId),
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },

  deleteCart: async () => {
    try {
      await axiosInstance.delete("/cart/delete");
      set({ cart: [], totalAmount: 0 });
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  },
}));

