

import { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore.js"; // Zustand store
import { axiosInstance } from "../lib/axios.js";

const MyOrdersPage = () => {
  const { orders, fetchOrders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleConfirmDelivery = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axiosInstance.patch("/order/confirm-delivery", {
        orderId: selectedOrder._id,
        deliveryPersonnelId: selectedOrder.deliveryPersonnel, // Replace with actual ID
      });

      setMessage(response.data.message || "Order marked as delivered!");
      updateOrderStatus(selectedOrder._id);

      // Auto-close modal after success
      setTimeout(() => {
        setSelectedOrder(null);
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to confirm delivery.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border border-gray-200">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="space-y-2 mb-4 md:mb-0">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-24">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-24">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.items.length} Items
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            </div>
            
            <div className="px-6 py-4">
              <ul className="space-y-3 mb-4">
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2">🛒</span>
                    <span className="text-gray-800">
                      {item.product.name} - <span className="font-medium">{item.quantity}</span>
                    </span>
                  </li>
                ))}
              </ul>
              
              {/* Show message if payment is pending */}
              {selectedOrder.paymentStatus !== "paid" && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-yellow-700">You have not paid for this order</p>
                </div>
              )}
              
              {message && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <p className="text-green-700">{message}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    selectedOrder.paymentStatus !== "paid"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={handleConfirmDelivery}
                  disabled={selectedOrder.paymentStatus !== "paid"}
                >
                  Confirm Delivery
                </button>
                
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={() => { setSelectedOrder(null); setMessage(""); }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;