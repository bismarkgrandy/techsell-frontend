import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useBarterStore } from "../store/useBarterStore.js";

const BarterUploadPage = () => {
  const { listItem } = useBarterStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    image: "",
    wantedItemDescription: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "wantedItemDescription" && value.length > 50) {
      setError("Wanted item description should not exceed 50 characters.");
    } else if (name === "phone" && !/^\d{0,10}$/.test(value)) {
      setError("Phone number must be exactly 10 digits.");
    } else {
      setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  // Resize image before upload
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");

          let width = img.width;
          let height = img.height;
          const maxSize = 800;

          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const resizedImage = canvas.toDataURL("image/jpeg", 0.7);
          resolve(resizedImage);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setFormData({ ...formData, image: resizedImage });
      } catch (err) {
        setError("Failed to process image. Please try a different one.");
      }
    }
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some((value) => !value)) {
      setError("Please fill in all fields before uploading.");
      return;
    }
  
    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
  
    setIsLoading(true);
    try {
      await listItem(formData);
      navigate("/barter", { replace: true });
      window.location.reload(); // Force refresh to get new items
    } catch (err) {
      setError("Failed to upload item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-3xl font-bold text-black-600 text-center">Upload Barter Item</h2>
      <p className="text-gray-700 text-center mt-2">
        List your item for barter and connect with other students!
      </p>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Item Name"
          className="w-full p-2 border rounded-md"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Item Description"
          className="w-full p-2 border rounded-md"
        />

        <input
          type="text"
          name="wantedItemDescription"
          value={formData.wantedItemDescription}
          onChange={handleChange}
          placeholder="Wanted Item (Max 50 characters)"
          className="w-full p-2 border rounded-md"
        />
        
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your Phone Number (10 digits)"
          className="w-full p-2 border rounded-md"
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <label className="block">
          <span className="sr-only">Choose an image</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-200 file:text-gray-700
              hover:file:bg-gray-300"
          />
        </label>
        
        {formData.image && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img src={formData.image} alt="Preview" className="w-full h-48 object-contain rounded-md border" />
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`mt-6 w-full flex items-center justify-center ${
          isLoading ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
        } text-white py-2 rounded-md transition`}
      >
        {isLoading ? (
          "Uploading..."
        ) : (
          <>
            <ArrowUpTrayIcon className="w-5 h-5 mr-2" /> Upload Item
          </>
        )}
      </button>

      <button
        onClick={() => navigate("/barter")}
        className="mt-4 w-full text-gray-600 hover:underline"
      >
        Back to Barter Listings
      </button>
    </div>
  );
};

export default BarterUploadPage;

