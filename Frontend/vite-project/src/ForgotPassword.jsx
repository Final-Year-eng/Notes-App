import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      alert("Email required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to your email");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ marginTop: "100px", textAlign: "center" }}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />

      <br />
      <br />

      <button
        type="button" // 🔥 IMPORTANT
        onClick={handleSendOTP}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Send Code
      </button>
    </div>
  );
};

export default ForgotPassword;
