import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const { verifyOtp, resendOtp } = useAuthStore();
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOtp(otp);
      localStorage.removeItem("signupData"); // Remove signup data after successful verification
      navigate("/"); // Redirect to the homepage after verification
    } catch (error) {
      alert(error.message || "OTP verification failed");
      setResendDisabled(false); // Allow resend after failed verification
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true)
    try {
      await resendOtp();
      alert("OTP has been resent to your email.");
      setResendDisabled(true);
    } catch (error) {
      alert(error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Enter OTP</h1>
      <p className="text-gray-500 mb-4">A 6-digit OTP has been sent to your email.</p>

      <input
        type="text"
        maxLength="6"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="p-2 border rounded w-64 text-center"
        placeholder="Enter OTP"
      />

      <button onClick={handleVerify} className="w-64 bg-black text-white p-2 rounded mt-4">
        Verify OTP
      </button>

      <button onClick={handleResend} className="w-64 bg-gray-300 p-2 rounded mt-2">
        Resend OTP
      </button>
    </div>
  );
};

export default OtpPage;


