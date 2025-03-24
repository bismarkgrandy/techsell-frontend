// src/store/useProductStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useProductStore = create((set) => ({
  products: [],
  filteredProducts: [],
  searchResults: [],
  loading: false,
  
  fetchProductsByCategory: async (categoryName) => {
    try {
      const response = await axiosInstance.get(`/products/search?category=${categoryName}`);
      
      // Assuming your API returns the products array directly or within a data property
      return response.data.products || response.data || [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  
  fetchProducts: async () => {
    try {
      const response = await axiosInstance.get(
        "/products?limit=15&page=1"
      );
      set({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await axiosInstance.get("/products/featured");
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },
  searchProducts: async (keyword) => {
    if (!keyword) {
      set({ searchResults: [] });
      return;
    }
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
      set({ searchResults: response.data, loading: false });
    } catch (error) {
      console.error("Error searching products:", error);
      set({ loading: false });
    }
  },
  
  // Add other product-related functions here
//   searchProducts: async (query) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/api/products/search?query=${query}`);
//       return response.data.products || response.data || [];
//     } catch (error) {
//       console.error("Error searching products:", error);
//       return [];
//     }
//   }
}));