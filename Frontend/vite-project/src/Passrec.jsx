import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Passrec = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  // 🔹 SEND OTP
  const handleSendCode = async () => {
    if (!email) {
      alert("Email required");
      return;
    }

    const res = await fetch("http://10.156.230.17:5000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setIsSuccess(true);
      setMessage("✅ OTP sent successfully to your email");
      setOtpSent(true);
    } else {
      setIsSuccess(false);
      setMessage(data.message || "Failed to send OTP");
    }
  };

  // 🔹 RESET PASSWORD
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      alert("All fields required");
      return;
    }

    const res = await fetch("http://10.156.230.17:5000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Password reset successful");
      navigate("/login");
    } else {
      alert(data.message || "Reset failed");
    }
  };

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div className="bg-white w-[90%] h-[420px] lg:w-[30%] p-10 rounded-lg lg:mt-[-50px] mt-[-350px] ">
        <h1 className="text-2xl font-bold text-center">Password Recovery</h1>

        {message && (
          <div
            className={`text-center p-2 mt-3 rounded font-semibold ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 border mt-10 px-3 rounded"
        />

        {/* SEND OTP */}
        {!otpSent && (
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-500 text-white h-10 mt-4 rounded font-bold"
          >
            Send OTP
          </button>
        )}

        {/* OTP + NEW PASSWORD */}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-10 border mt-4 px-3 rounded"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 border mt-4 px-3 rounded"
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-500 text-white h-10 mt-4 rounded font-bold"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Passrec;
