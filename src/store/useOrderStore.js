import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useOrderStore = create((set) => ({
    orders:[],
    fetchOrders: async () => {
        try {
          const response = await axiosInstance.get("/order/my-orders");
          console.log("API Response:", response.data); // Debug the response
          set({ orders: response.data.orders || [] }); // Extract the orders array
        } catch (error) {
          console.error("Error fetching orders:", error);
          set({ orders: [] }); // Fallback to an empty array on error
        }
      },
    
      // Update the status of an order
      updateOrderStatus: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, status: "delivered" } : order
          ),
        }));
      },
    
  placeOrder: async () => {
    try {
        const response = await axiosInstance.post("/order/place-order");
        console.log(response)
        return response.data; // Return the response data to the caller
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  },
}));
