

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBarterStore } from "../store/useBarterStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

const BarterPage = () => {
  const { barterItems, fetchBarterItems, delistItem } = useBarterStore();
  const { authUser } = useAuthStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarterItems();
  }, []);

  const handleDelistConfirmation = (itemId, authUserId, ownerId) => {
    setShowConfirmation(true);
  };

  const handleDelistConfirmed = (itemId, authUserId, ownerId) => {
    delistItem(itemId, authUserId, ownerId);
    setShowConfirmation(false);
    setSelectedItem(null);
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Barter Section Title */}
      <div className="text-center py-6 max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-black">Barter on TechSell</h2>
        <p className="text-lg mt-2 text-gray-700">
        Exchange your items easily with TechSell's seamless barter system. Feel free to browse available items, 
        connect directly with owners, and negotiate a trade that benefits both parties. 
        No middlemen, no extra costs—just a smooth and exciting way to swap what you no longer need for something new! 
        Start exploring and make your next great trade today!
        </p>
      </div>

      {/* Available for Barter Section */}
      <div className="px-6 text-center">
        <h3 className="text-3xl font-bold text-black border-b-4 border-red-600 inline-block pb-2">
          Available for Barter
        </h3>

        {/* Barter Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {barterItems.map((item) => (
            <div key={item._id} className="bg-white p-4 shadow-md rounded-md border border-gray-200">
              <img src={item.image} alt={item.itemName} className="w-full h-64 object-contain rounded-md" />
              <h4 className="font-bold text-lg mt-2 text-black">{item.itemName}</h4>
              <p className="text-gray-600">{item.description.slice(0, 50)}...</p>
              <button
                onClick={() => setSelectedItem(item)}
                className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md w-full hover:bg-gray-900 transition"
              >
                View Item
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Item Details */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-extrabold text-center text-black">{selectedItem.itemName}</h2>
            <img src={selectedItem.image} alt={selectedItem.itemName} className="w-full h-56 object-contain mt-2 rounded-md" />
            <p className="mt-2">{selectedItem.description}</p>
            <p className="mt-2"><strong>Wanted Item:</strong> {selectedItem.wantedItemDescription}</p>
            <p className="mt-2"><strong>Owner:</strong> {selectedItem.owner.username}</p>
            <p className="mt-2"><strong>Contact:</strong> {selectedItem.phone}</p>

            {/* Delist Button - Kept Red */}
            {authUser?._id === selectedItem.owner._id && (
              <button
                onClick={() => handleDelistConfirmation(selectedItem._id, authUser._id, selectedItem.owner._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-700 transition"
              >
                Delist Item
              </button>
            )}

            {/* Close Button */}
            <button onClick={() => setSelectedItem(null)} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md w-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-bold text-center">Confirm Deletion</h3>
            <p className="my-4 text-center">Are you sure you want to delist this item?</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleDelistConfirmed(selectedItem._id, authUser._id, selectedItem.owner._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-24"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated Upload Barter Section with your provided image */}
      <div className="flex flex-col items-center justify-center mt-12 pb-12">
        <h3 className="text-2xl font-bold text-black mb-4">Want to trade for other items?</h3>
        <div
          className="bg-gray-200 p-4 rounded-md cursor-pointer hover:bg-gray-300 transition duration-300"
          onClick={() => navigate("/barter-upload")}
        >
          {/* SVG matching your provided image */}
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="8" fill="#E5E5E5" />
            <path d="M48 90C40.8203 90 35 84.1797 35 77C35 69.8203 40.8203 64 48 64H73C80.1797 64 86 69.8203 86 77C86 84.1797 80.1797 90 73 90H48Z" stroke="black" strokeWidth="6" />
            <path d="M60 30V64" stroke="black" strokeWidth="6" strokeLinecap="round" />
            <path d="M40 50L60 30L80 50" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="83" cy="77" r="2" fill="black" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BarterPage;