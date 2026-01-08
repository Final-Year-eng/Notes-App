import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setIsSuccess(false);
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://10.156.230.17:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("✅ Password reset successful! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Reset failed");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Server error. Please try again");
    }
  };

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter OTP and create a new password
        </p>

        {/* MESSAGE BOX */}
        {message && (
          <div
            className={`text-center p-3 mb-5 rounded-lg font-semibold border ${
              isSuccess
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border h-11 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border h-11 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 h-11 font-bold rounded-lg transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
