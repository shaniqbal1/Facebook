import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Register = ({ switchToLogin }) => {
  // ✅ removed firstName/lastName + DOB
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender
      };

      await axios.post("http://localhost:8000/api/auth/register", payload);

      alert("Registration successful");
      switchToLogin();
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] w-[432px]"
    >
      <div className="text-center mb-4">
        <h2 className="text-[25px] font-bold text-[#1c1e21]">
          Create a new account
        </h2>
        <p className="text-[#606770] text-[15px]">
          It's quick and easy.
        </p>
      </div>

      <div className="border-t border-[#dadde1] mb-4"></div>

      <form onSubmit={handleRegister} className="space-y-3">

        {/* ❌ REMOVED firstName + lastName → NOW SINGLE NAME */}
        <input
          name="name"
          placeholder="Full name"
          required
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-[#1877f2] bg-[#f5f6f7] placeholder-[#8d949e]"
        />

        <input
          name="email"
          type="email"
          placeholder="Mobile number or email address"
          required
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-[#1877f2] bg-[#f5f6f7] placeholder-[#8d949e]"
        />

        <input
          name="password"
          type="password"
          placeholder="New password"
          required
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-[#1877f2] bg-[#f5f6f7] placeholder-[#8d949e]"
        />

        {/* ❌ REMOVED DATE OF BIRTH COMPLETELY */}

        {/* GENDER (UNCHANGED) */}
        <div>
          <label className="text-[#606770] text-[12px] font-medium block mb-1">
            Gender
          </label>

          <div className="flex gap-3">
            {["Female", "Male", "Custom"].map((g) => (
              <label
                key={g}
                className="flex-1 flex items-center justify-between border border-[#ccd0d5] rounded-[4px] px-3 py-2 cursor-pointer hover:bg-[#f5f6f7]"
              >
                <span className="text-[15px] text-[#1c1e21]">{g}</span>

                <input
                  type="radio"
                  name="gender"
                  value={g.toLowerCase()}
                  required
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#1877f2]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="submit"
            className="bg-[#00a400] hover:bg-[#008f00] text-white text-[18px] font-bold px-8 py-2 rounded-[6px] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            switchToLogin();
          }}
          className="text-[#1877f2] text-[17px] font-medium hover:underline"
        >
          Already have an account?
        </a>
      </div>
    </motion.div>
  );
};

export default Register;