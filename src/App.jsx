import React from "react";
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import OtpPage from "./pages/OtpPage.jsx";
import FeaturedProductsPage from "./pages/FeaturedProductsPage.jsx";
import BarterPage from "./pages/BarterPage.jsx";
import BarterUploadPage from "./pages/BarterUploadPage.jsx";
import SellersPage from "./pages/SellersPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import MyAccountPage from "./pages/MyAccountPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import SearchResultsPage from "./pages/searchResultsPage.jsx";
import PaymentStatusPage from "./pages/PaymentStatusPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import Loader from "./components/Loader.jsx";

import { Toaster } from "react-hot-toast";


const PrivateRoute = ({ children }) => {
  const signupData = localStorage.getItem("signupData");
  return signupData ? children : <Navigate to="/signup" />;
};

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation(); // Get current page route

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);
  
  if (isCheckingAuth && !authUser) return <Loader />;

  // Hide Navbar on login and signup pages
  const hideNavbarRoutes = ["/login", "/signup", "/otp", ];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);


  return (
    <div>
     <Toaster />
      {shouldShowNavbar && <Navbar />}  {/* Show Navbar only on allowed pages */}

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/otp" element={<PrivateRoute><OtpPage /></PrivateRoute>} />
        <Route path="/featured-products" element={authUser ? <FeaturedProductsPage /> : <Navigate to="/login" />} />
        <Route path="/barter" element={authUser ? <BarterPage /> : <Navigate to="/login" />} />
        <Route path="/barter-upload" element={authUser ? <BarterUploadPage /> : <Navigate to="/login" />} />
        <Route path="/seller-upload" element={authUser ? <SellersPage/> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={authUser ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/cart" element={authUser ? <CartPage /> : <Navigate to="/login" />} />
        <Route path="/account" element={authUser ? <MyAccountPage /> : <Navigate to="/login" />} />
        <Route path="/orders" element={authUser ? <MyOrdersPage /> : <Navigate to="/login" />} />
        <Route path="/payment-status" element={authUser ? <PaymentStatusPage /> : <Navigate to="/login" />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route  path="/categories/:categoryName"  element={authUser ? <CategoryPage /> : <Navigate to="/login" />}
        
         
/>       </Routes>
    </div>
  );
};

export default App;
