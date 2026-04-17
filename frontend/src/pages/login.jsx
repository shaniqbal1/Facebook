import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Login = ({ switchToRegister }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] w-[396px]"
    >
      <form onSubmit={handleLogin} className="space-y-3">
        <input 
          name="email" 
          type="text" 
          placeholder="Email address or mobile number" 
          required 
          onChange={handleChange} 
          className="w-full px-4 py-3.5 border border-[#dddfe2] rounded-[6px] text-[17px] focus:outline-none focus:border-[#1877f2] focus:shadow-[0_0_0_2px_#e7f3ff] placeholder-[#90949c]" 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          required 
          onChange={handleChange} 
          className="w-full px-4 py-3.5 border border-[#dddfe2] rounded-[6px] text-[17px] focus:outline-none focus:border-[#1877f2] focus:shadow-[0_0_0_2px_#e7f3ff] placeholder-[#90949c]" 
        />

        <button 
          type="submit"
          className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white text-[20px] font-bold py-3 rounded-[6px] transition-colors"
        >
          Log in
        </button>
      </form>

      <div className="mt-4 text-center">
        <a href="#" className="text-[#1877f2] text-[14px] font-medium hover:underline">
          Forgotten password?
        </a>
      </div>

      <div className="my-5 border-t border-[#dadde1]"></div>

      <div className="text-center pb-2">
        <button 
          onClick={switchToRegister}
          className="bg-[#42b72a] hover:bg-[#36a420] text-white text-[17px] font-bold px-4 py-3 rounded-[6px] inline-block transition-colors"
        >
          Create new account
        </button>
      </div>
    </motion.div>
  );
};

export default Login;