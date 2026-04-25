import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ switchToRegister }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [verifiedMsg, setVerifiedMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // show verification message once
  useEffect(() => {
    if (location.pathname === "/login") {
      setVerifiedMsg("Email verified successfully. You can now login.");
    }
  }, [location.pathname]);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        credentials
      );

      // 🔐 SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      setLoading(false);

      // 🚀 redirect to dashboard/profile
      navigate("/dashboard");

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // auto hide verification message
  useEffect(() => {
    if (verifiedMsg) {
      const timer = setTimeout(() => setVerifiedMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [verifiedMsg]);

  return (
    <div className="bg-white rounded-lg w-[396px] shadow-lg">
      <form onSubmit={handleLogin} className="p-4 space-y-3">

        {/* SUCCESS MESSAGE */}
        {verifiedMsg && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded">
            {verifiedMsg}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded"
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded"
          />

          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-3 text-blue-500 text-sm"
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* SWITCH TO REGISTER */}
      <div className="text-center py-4">
        <button
          onClick={switchToRegister}
          className="text-blue-500 text-sm"
        >
          Create new account
        </button>
      </div>
    </div>
  );
};

export default Login;