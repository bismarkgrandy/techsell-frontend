import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentStatusPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status"); // Extract status from URL
  const reference = queryParams.get("reference"); // Extract reference ID

  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    if (status === "success") {
      setMessage("Payment successful! Your order is being processed.");
    } else if (status === "failed") {
      setMessage("Payment failed. Please try again.");
    } else {
      setMessage("Payment is processing. Feel free to check your orders.");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
      {reference && <p className="text-gray-600">Transaction ID: {reference}</p>}
      <Link to="/orders" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Go to Orders
      </Link>
    </div>
  );
};

export default PaymentStatusPage;
