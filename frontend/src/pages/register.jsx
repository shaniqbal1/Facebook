import React, { useState, useEffect } from "react";
import axios from "axios";

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: ""
  });

  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ─── INPUT HANDLER ─── */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setError("");
    setSuccessMsg("");
  };

  /* ─── REGISTER ─── */
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.gender
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/api/auth/register",
        formData
      );

      setSuccessMsg("User registered successfully. Please verify your email.");

      // reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        gender: ""
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  /* ─── AUTO HIDE SUCCESS ─── */
  useEffect(() => {
    if (!successMsg) return;

    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMsg]);

  return (
    <div className="bg-white rounded-lg w-[396px] shadow-lg">

      <form onSubmit={handleRegister} className="p-4 space-y-3">

        {/* success */}
        {successMsg && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded">
            {successMsg}
          </div>
        )}

        {/* error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
            {error}
          </div>
        )}

        {/* name */}
        <input
          name="name"
          value={formData.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded outline-none"
        />

        {/* username */}
        <input
          name="username"
          value={formData.username}
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded outline-none"
        />

        {/* email */}
        <input
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded outline-none"
        />

        {/* password */}
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            type={showPw ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-3 text-blue-500 text-sm"
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        {/* ─── FIXED GENDER UI (MODERN COLORS) ─── */}
        <div className="grid grid-cols-3 gap-2 text-sm">

          {/* Male */}
          <label className={`cursor-pointer px-3 py-2 rounded-lg text-center border transition-all
            ${
              formData.gender === "male"
                ? "bg-blue-600 text-white border-blue-400 shadow-md"
                : "bg-white/5 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="hidden"
            />
            Male
          </label>

          {/* Female */}
          <label className={`cursor-pointer px-3 py-2 rounded-lg text-center border transition-all
            ${
              formData.gender === "female"
                ? "bg-pink-500 text-white border-pink-400 shadow-md"
                : "bg-white/5 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              className="hidden"
            />
            Female
          </label>

          {/* Other */}
          <label className={`cursor-pointer px-3 py-2 rounded-lg text-center border transition-all
            ${
              formData.gender === "other"
                ? "bg-violet-500 text-white border-violet-400 shadow-md"
                : "bg-white/5 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleChange}
              className="hidden"
            />
            Other
          </label>

        </div>

        {/* submit */}
        <button className="w-full bg-blue-500 text-white py-3 rounded">
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      {/* switch */}
      <div className="text-center py-4">
        <button
          onClick={switchToLogin}
          className="text-blue-500 text-sm"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
};

export default Register;