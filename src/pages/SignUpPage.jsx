import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Eye , EyeOff} from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    studentEmail: "",
    residence:"",
    password: "",
  });


  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigate = useNavigate();
  const {signup} = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      localStorage.setItem("signupData", JSON.stringify(formData));
      navigate("/otp");

    } catch (error) {
      alert(error.message || "Signup failed")
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
            name="username"
            placeholder="Username"
            className="w-full p-2 border rounded mb-3"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="studentEmail"
            placeholder="Student Email"
            className="w-full p-2 border rounded mb-3"
            value={formData.studentEmail}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="residence"
            placeholder="Residence"
            className="w-full p-2 border rounded mb-3"
            value={formData.residence}
            onChange={handleChange}
            required
          />
          <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}  // Toggles between "password" and "text"
    name="password"
    placeholder="Password"
    className="w-full p-2 border rounded mb-3 pr-10"  // Add padding to the right for the icon
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>

      {/* Right Side - Image */}
      <div 
  className="hidden md:block md:w-1/2 h-screen bg-cover bg-center bg-no-repeat" 
  style={{ backgroundImage: "url('/images/signupImage.jpg')" }}>
</div>

    </div>
  );
};

export default SignUp;

