

import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications
import { axiosInstance } from "../lib/axios.js";
const SellersPage = () => {
  const initialFormState = {
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        toast.error("Failed to process image. Please try a different one.");
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/products/list-product", formData);
      
      toast.success("Product uploaded successfully!");
      resetForm(); // Reset the form instead of navigating away
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to upload product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-3xl font-bold text-black-600 text-center">Sell Your Product</h2>
      <p className="text-gray-700 text-center mt-2">
        List your item for sale and connect with other students!
      </p>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border rounded-md"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded-md"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full p-2 border rounded-md"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>

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
    </div>
  );
};

export default SellersPage;