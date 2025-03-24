

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { useCartStore } from "../store/useCartStore.js";
import { Menu, Search, User, ShoppingCart, ChevronDown, X } from "lucide-react";

import { Toaster } from 'react-hot-toast';

import toast from 'react-hot-toast';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(authUser?.roles?.includes("admin"));
  const [dropdown, setDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for closing dropdowns when clicking outside
  const categoriesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const mobileMenuDropdownRef = useRef(null);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?search=${searchQuery}`);
    setSearchQuery("");
  };

  // Handle Admin Hub Access
  const handleAdminHub = () => {
    if (!isAdmin) {
      
      toast.error("Access Denied: You are not assigned the admin role")
    } else {
      navigate("/admin-dashboard");
    }
  };

  // Toggle dropdown menus
const toggleDropdown = (menu) => {
  if (dropdown === menu) {
    setDropdown(null);
  } else {
    setDropdown(menu);
    setMobileMenu(false); // Close mobile menu when opening a dropdown
  }
};

// Toggle Mobile Menu
const toggleMobileMenu = () => {
  setMobileMenu(!mobileMenu);
  setDropdown(null); 
};


  // Fetch cart data and navigate to cart
  const handleCartClick = async () => {
    await fetchCart();
    navigate("/cart");
  };

  const handleLogout = async() => {
    await logout(); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target) &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        mobileMenuDropdownRef.current &&
        !mobileMenuDropdownRef.current.contains(event.target)
      ) {
        setDropdown(null);
        setMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-lg relative">
    <Toaster />
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">TECHSELL</Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        {/* Categories */}
        <div className="relative" ref={categoriesDropdownRef}>
          <button onClick={() => toggleDropdown("categories")} className="flex items-center hover:text-gray-300">
            Categories <ChevronDown size={16} className="ml-1" />
          </button>
          {dropdown === "categories" && (
            <div className="absolute bg-white text-black rounded shadow-lg p-2 mt-2 w-40 z-50">
              <Link to="/categories/electronics" className="block px-4 py-2 hover:bg-gray-200 border-b">Electronics</Link>
              <Link to="/categories/clothing" className="block px-4 py-2 hover:bg-gray-200 border-b">Clothing</Link>
              <Link to="/categories/jewelry" className="block px-4 py-2 hover:bg-gray-200">Jewelry</Link>
            </div>
          )}
        </div>
        <Link to="/featured-products" className="hover:text-gray-300">Featured Products</Link>
        <Link to="/barter" className="hover:text-gray-300">Barter</Link>
        <button onClick={handleAdminHub} className="hover:text-gray-300">Admin Hub</button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative hidden md:block">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-1 rounded-l bg-gray-800 text-white border-none focus:ring"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 px-3 py-1 rounded-r hover:bg-blue-700">
          <Search size={18} />
        </button>
      </form>

      {/* Profile & Cart */}
      <div className="flex items-center space-x-4">
        {/* Cart */}
        <button onClick={handleCartClick} className="relative hover:text-gray-300">
          <ShoppingCart size={22} />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button onClick={() => toggleDropdown("profile")} className="hover:text-gray-300">
            <User size={20} />
          </button>
          {dropdown === "profile" && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg p-2 w-48 z-50">
              <p className="px-4 py-2 font-semibold border-b">Hi, {authUser?.username || "Guest"}</p>
              <Link to="/account" className="block px-4 py-2 hover:bg-gray-200 border-b">My Account</Link>
              <Link to="/orders" className="block px-4 py-2 hover:bg-gray-200 border-b">My Orders</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Sign Out</button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden" ref={mobileMenuDropdownRef}>
          <button onClick={toggleMobileMenu} className="hover:text-gray-300">
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          {mobileMenu && (
            <div className="absolute right-0 top-12 bg-white text-black rounded shadow-lg w-48 p-2 z-50">
              <Link to="/categories/electronics" className="block px-4 py-2 hover:bg-gray-200 border-b">Electronics</Link>
              <Link to="/categories/clothing" className="block px-4 py-2 hover:bg-gray-200 border-b">Clothing</Link>
              <Link to="/categories/jewelry" className="block px-4 py-2 hover:bg-gray-200 border-b">Jewelry</Link>
              <Link to="/featured-products" className="block px-4 py-2 hover:bg-gray-200 border-b">Featured Products</Link>
              <Link to="/barter" className="block px-4 py-2 hover:bg-gray-200 border-b">Barter</Link>
              <button onClick={handleAdminHub} className="block px-4 py-2 hover:bg-gray-200 border-b">Admin Hub</button>
              <button onClick={handleCartClick} className="block px-4 py-2 hover:bg-gray-200 border-b">Cart</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;







