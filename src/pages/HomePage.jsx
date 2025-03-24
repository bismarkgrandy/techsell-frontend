import { useState, useEffect } from "react";
import { useProductStore } from "../store/useProductStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useCartStore } from "../store/useCartStore.js"; // Import cart store
import Loader from "../components/Loader.jsx";

const HomePage = () => {
  const { products, fetchProducts } = useProductStore();
  const { authUser } = useAuthStore();
  const { addToCart } = useCartStore(); // Get addToCart function
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState(""); // Success/Error message
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  const scrollToMarketplace = () => {
    document.getElementById("marketplace-section").scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    try {
      await addToCart(selectedProduct._id); // Add to cart
      setCartMessage("Item added to cart successfully! ✅");
      setTimeout(() => setCartMessage(""), 3000); // Clear after 3 seconds
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setCartMessage("Failed to add item to cart ❌");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex flex-col md:flex-row h-auto md:h-[80vh] py-8 md:py-0">
          <div className="md:w-1/2 flex flex-col justify-center px-4 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-3">
              Hi, {authUser?.username}!
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Welcome to your personal marketplace
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
              At Techsell, we bring e-commerce to KNUST students, offering a seamless platform to
              discover, connect, and trade with fellow students.
            </p>
            <button
              onClick={scrollToMarketplace}
              className="bg-[#457B9D] text-white px-6 py-3 rounded-lg hover:bg-[#1D3557] transition w-full md:w-auto"
            >
              Explore Products
            </button>
          </div>
          <div className="md:w-1/2 h-full flex justify-center mt-8 md:mt-0">
            <img
              src="/images/homePageImage.jpg"
              alt="Marketplace Banner"
              className="w-full h-64 md:h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Marketplace Heading */}
      <div id="marketplace-section" className="w-full bg-gray-100 py-12">
        <h1 className="text-3xl font-bold text-center text-black-500">
          YOUR MARKETPLACE
        </h1>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 overflow-hidden"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="bg-gray-100 p-4 flex justify-center items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  ₵{product.price.toFixed(2)}
                </p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg max-h-screen overflow-y-auto">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-auto max-h-60 object-contain rounded-lg"
            />
            <h2 className="text-xl sm:text-2xl font-bold mt-4 text-center">
              {selectedProduct.name}
            </h2>
            <p className="text-gray-700 mt-2 text-sm sm:text-base text-center">
              {selectedProduct.description}
            </p>
            <p className="text-lg font-semibold mt-2 text-center">
              ₵{selectedProduct.price.toFixed(2)}
            </p>

            {/* Success Message */}
            {cartMessage && (
              <p className="text-green-600 text-center mt-2">{cartMessage}</p>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-green-700 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg w-full sm:w-auto"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Techsell Info Section */}
      <div className="mt-10 bg-[#1D3557] text-white py-8 px-6 text-center rounded-lg shadow-md max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl font-semibold">Techsell</h2>
        <p className="mt-2 text-lg">
          Techsell is an online marketing platform specifically built for Kwame
          Nkrumah University of Science and Technology to provide an auspicious
          and seamless marketing experience for students.
        </p>
        <div className="mt-4 flex justify-center space-x-6 text-xl">
          <span className="hover:text-blue-200 cursor-pointer transition">📘 Facebook</span>
          <span className="hover:text-blue-200 cursor-pointer transition">🐦 Twitter</span>
          <span className="hover:text-blue-200 cursor-pointer transition">💼 LinkedIn</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
