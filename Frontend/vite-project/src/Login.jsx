import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://10.156.230.17:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("✅ Login successful! Redirecting...");

        setTimeout(() => {
          localStorage.setItem("token", data.token);
          navigate("/notes");
        }, 1500);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Server error");
    }
  };

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div className="lg:w-[30%] lg:h-[550px] bg-white rounded-lg w-[85%] h-[500px] p-6 lg:mt-[-50px] mt-[-200px]">
        <h1 className="font-bold text-2xl text-center">Notes App</h1>
        <p className="text-center">Keep your thoughts organized</p>

        {/* MESSAGE */}
        {message && (
          <div
            className={`text-center p-2 mt-4 rounded font-semibold ${
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 border mt-[60px] px-3 rounded"
        />

        {/* PASSWORD */}
        <div className="relative mt-[20px]">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 border px-3 rounded"
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        {/* FORGOT */}
        <div className="text-right mt-[20px]">
          <Link to="/passrec" className="text-blue-600">
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleLogin}
          className="w-full h-10 bg-blue-500 text-white font-bold mt-[70px]  lg:mt-[30%] rounded"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don’t have an account?
          <Link to="/signup" className="text-blue-600 ml-1">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
