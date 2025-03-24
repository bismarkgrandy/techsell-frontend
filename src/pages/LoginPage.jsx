import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    studentEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Get login function from Zustand store

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate("/"); // Redirect to dashboard or homepage after login
    } catch (error) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <h1 className="text-3xl font-bold">TechSell</h1>
        <p className="text-gray-600">Your Campus, Your Market</p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
          <input
            type="text"
            name="studentEmail"
            placeholder="Student Email"
            className="w-full p-2 border rounded mb-3"
            value={formData.studentEmail}
            onChange={handleChange}
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded mb-3 pr-10"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-lg font-semibold mt-3 ${
              loading ? "bg-gray-500" : "bg-black text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Right Side - Image */}
      <div 
        className="hidden md:block md:w-1/2 h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/signupImage.jpg')" }}
      />
    </div>
  );
};

export default Login;