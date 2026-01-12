import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      alert("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("✅ Account created successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server not reachable");
      console.error(err);
    }
  };

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div className="lg:w-[30%] lg:h-[480px] bg-white rounded-lg w-[85%] h-[500px] lg:mt-[-50px] mt-[-200px]">
        <h1 className="font-bold text-2xl mt-5 text-center">Notes App</h1>
        {message && (
          <div
            className={`text-center p-2 mb-4 rounded font-semibold ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex justify-center gap-40 mt-5">
          <Link to="/login" className="font-bold text-gray-500">
            Login
          </Link>
          <p className="font-bold text-blue-500">Signup</p>
        </div>

        <input
          placeholder="Full Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-[90%] h-10 border mt-6 px-3 rounded mx-auto block"
        />

        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[90%] h-10 border mt-3 px-3 rounded mx-auto block"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[90%] h-10 border mt-3 px-3 rounded mx-auto block"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-[90%] h-10 border mt-3 px-3 rounded mx-auto block"
        />

        <button
          type="button"
          onClick={handleSignup}
          className="w-[90%] h-10 bg-blue-500 text-white font-bold mt-[75px] rounded mx-auto block"
        >
          Create Account
        </button>

        <p className="mt-4 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
