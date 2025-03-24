

import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { useAuthStore } from "../store/useAuthStore.js";
const MyAccountPage = () => {
  const { authUser } = useAuthStore(); // Destructure authUser from useAuthStore
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const navigate = useNavigate(); // For navigation

  // Form fields
  const [storeName, setStoreName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/user/me");
        setUser(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load user data.");
      }
    };
    fetchUser();
  }, []);

  const handleBecomeSeller = async () => {
    try {
      const response = await axiosInstance.post("/auth/become-seller", {
        storeName,
        sellerPhone,
        idNumber,
      });
      setMessage(response.data.message || "You are now a seller!");
      setShowSellerForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to become a seller.");
      setShowSellerForm(false);
    }
  };

  const handleBecomeDelivery = async () => {
    try {
      const response = await axiosInstance.post("/auth/become-delivery", {
        deliveryPhone,
      });
      setMessage(response.data.message || "You are now a delivery personnel!");
      setShowDeliveryForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to become a delivery personnel.");
    }
  };

  // Navigate to seller upload page
  const goToSellerUpload = () => {
    navigate("/seller-upload");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-black text-white py-6 shadow-md">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">My Account</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {message && (
          <div className="mb-6 bg-gray-200 border-l-4 border-gray-500 text-gray-700 p-4 rounded shadow">
            <p>{message}</p>
          </div>
        )}

        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-white text-3xl font-bold mb-3">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
                  <p className="text-gray-600 text-sm mt-1">{user.studentEmail}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Username</p>
                    <p className="text-gray-800 font-medium">{user.username}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-gray-800 font-medium">{user.studentEmail}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Residence</p>
                    <p className="text-gray-800 font-medium">{user.residence}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles & Options */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">My Roles</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <span key={index} className="
                        px-3 py-1 rounded-full text-sm font-medium
                        bg-gray-200 text-gray-800 border border-gray-300
                      ">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No roles assigned</p>
                  )}
                </div>

                {/* Only show Seller Upload Button if authUser.roles includes 'seller' */}
                {authUser && authUser.roles && authUser.roles.includes('seller') && (
                  <div className="mb-6">
                    <button 
                      onClick={goToSellerUpload}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Want to list item as a seller?</span>
                    </button>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Available Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Become Seller Card */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Seller Account</h4>
                    <p className="text-gray-600 text-sm mb-4">Create a seller account to list products for sale on the platform.</p>
                    <button 
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      onClick={() => setShowSellerForm(true)}
                    >
                      Become a Seller
                    </button>
                  </div>

                  {/* Become Delivery Card */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Delivery Personnel</h4>
                    <p className="text-gray-600 text-sm mb-4">Join our delivery team to help deliver orders to customers.</p>
                    <button 
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      onClick={() => setShowDeliveryForm(true)}
                    >
                      Become Delivery Personnel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading user data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Seller Form Modal */}
      {showSellerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Become a Seller</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowSellerForm(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input 
                  id="storeName"
                  type="text" 
                  placeholder="Enter your store name" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
              <div>
                <label htmlFor="sellerPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  id="sellerPhone"
                  type="text" 
                  placeholder="Enter your phone number" 
                  value={sellerPhone} 
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input 
                  id="idNumber"
                  type="text" 
                  placeholder="Enter your ID number" 
                  value={idNumber} 
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setShowSellerForm(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleBecomeSeller}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Personnel Form Modal */}
      {showDeliveryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Become Delivery Personnel</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowDeliveryForm(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div>
              <label htmlFor="deliveryPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                id="deliveryPhone"
                type="text" 
                placeholder="Enter your phone number" 
                value={deliveryPhone} 
                onChange={(e) => setDeliveryPhone(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setShowDeliveryForm(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleBecomeDelivery}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccountPage;