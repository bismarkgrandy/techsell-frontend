

import { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore.js";
import { useOrderStore } from "../store/useOrderStore.js";

import toast from "react-hot-toast";

const CartPage = () => {
  const { cart, fetchCart, updateQuantity, clearItem, deleteCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate total amount dynamically
  const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 10 : 0;
  const finalAmount = totalAmount + deliveryFee;

  // Handle Confirm Order
  const handleConfirmOrder = async () => {
    try {
      const response = await placeOrder(); // This should return the order response from the backend
      if (response.paystackUrl) {
        window.location.href = response.paystackUrl; // Redirect to Paystack
      } else {
        alert("Error processing payment. Please try again.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  

  const handleClearCart = () => {
    // Display a custom confirmation toast
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p>Are you sure you want to clear your cart?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => {
                deleteCart(); // Call the delete function
                toast.dismiss(t.id); // Dismiss the toast
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => toast.dismiss(t.id)} // Dismiss the toast
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep the toast open until dismissed
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Your cart is empty 😢</p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-md">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b py-4">
              <div>
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-500">Price: GHS {item.product.price.toFixed(2)}</p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  +
                </button>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <button
                  onClick={() => clearItem(item._id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: GHS {totalAmount.toFixed(2)}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Place Order
            </button>
          </div>
          <button
            onClick={handleClearCart}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h2 className="text-2xl font-bold mb-4">Confirm Order</h2>
            <p className="text-lg">Total Amount: GHS {finalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Delivery fee is an additional 10 cedis.</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleConfirmOrder}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Order
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;


