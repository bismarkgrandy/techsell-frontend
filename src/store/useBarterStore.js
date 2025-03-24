

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useBarterStore = create((set) => ({
  barterItems: [],
  isLoading: false,
  error: null,
  
  fetchBarterItems: async () => {
    try {
      const response = await axiosInstance.get("/barter");
      set({ barterItems: response.data });
    } catch (error) {
      console.error("Error fetching barter items:", error);
    }
  },
  
  listItem: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/barter/list-item", formData);
      set((state) => ({
        barterItems: [...state.barterItems, response.data],
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      console.error("Error listing barter item:", error.message);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  
  delistItem: async (itemId, authUserId, ownerId) => {
    if (authUserId !== ownerId) {
      alert("You are not the rightful owner to delete this item!");
      return;
    }
    try {
      await axiosInstance.patch(`/barter/delist/${itemId}`);
      set((state) => ({
        barterItems: state.barterItems.filter((item) => item._id !== itemId)
      }));
    } catch (error) {
      console.error("Error delisting item:", error);
    }
  }
}));

export default useBarterStore;