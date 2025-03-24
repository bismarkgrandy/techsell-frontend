import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore.js";
import { useCartStore } from "../store/useCartStore.js"; // Import useCartStore
import Loader from "../components/Loader.jsx";

const CategoryProductsPage = () => {
  const { categoryName } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState(""); // State for success message
  const { fetchProductsByCategory } = useProductStore();
  const { addToCart } = useCartStore(); // Get addToCart function from Zustand

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await fetchProductsByCategory(categoryName);
        setProducts(result);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName, fetchProductsByCategory]);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      await addToCart(selectedProduct._id); // Call Zustand function
      setCartMessage("Item added to cart successfully! ✅"); // Show success message
      setTimeout(() => setCartMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setCartMessage("Failed to add item to cart ❌");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{categoryName} Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-200 p-2 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-bold">{product.name}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {product.description.length > 50
                    ? `${product.description.substring(0, 50)}...`
                    : product.description}
                </p>
                <p className="text-lg font-semibold mt-2">₵{product.price.toFixed(2)}</p>
                <button
                  className="mt-4 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing product details */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
    </div>
  );
};

export default CategoryProductsPage;

