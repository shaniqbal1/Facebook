import React, { useState } from "react";
import { motion } from "framer-motion";
import Login from "./login";
import Register from "./register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-[1000px] w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        
        {/* Left Side - Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          {/* Facebook Logo */}
          <div className="mb-4">
            <svg viewBox="0 0 36 36" className="w-[60px] h-[60px] inline-block lg:block" fill="url(#grad1)">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#18AFFF", stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#0062E0", stopOpacity:1}} />
                </linearGradient>
              </defs>
              <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z"/>
              <path fill="white" d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.09 1.116-4.09 4.025V18h5.831l-.995 5.5h-4.836v11.37a19.183 19.183 0 0 1-6.483-.399Z"/>
            </svg>
          </div>

          {/* Main Headline */}
          <h1 className="text-[#1c1e21] text-[28px] lg:text-[32px] font-bold leading-tight mb-4">
            Explore the<br />
            <span className="text-[#1877f2]">things you love.</span>
          </h1>

          {/* Collage Images Container */}
          <div className="relative w-full max-w-[400px] h-[300px] mx-auto lg:mx-0 mt-8 hidden md:block">
            {/* Main Phone Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute right-[10%] top-0 w-[180px] h-[280px] bg-white rounded-[20px] shadow-2xl overflow-hidden border-4 border-white z-20"
            >
              <div className="w-full h-full bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏃</div>
                    <p className="text-sm text-gray-600">Skateboarding</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-[#1877f2] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  16:45
                </div>
              </div>
            </motion.div>

            {/* Secondary Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute left-[5%] top-[20%] w-[140px] h-[160px] bg-[#E8D5C4] rounded-[16px] shadow-xl overflow-hidden border-4 border-white z-10"
            >
              <div className="w-full h-full bg-[#B8D4E3] relative flex items-center justify-center">
                <div className="text-5xl">🧶</div>
                <div className="absolute top-2 left-2 bg-white/80 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Third Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute left-[15%] bottom-[5%] w-[130px] h-[140px] bg-white rounded-[16px] shadow-xl overflow-hidden border-4 border-white z-30"
            >
              <div className="w-full h-full bg-[#F4E7E7] relative flex items-center justify-center">
                <div className="text-4xl">🎟️</div>
                <div className="absolute top-2 left-2 bg-[#1877f2] p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 right-3 space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>

            {/* Floating Emoji */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute left-[25%] top-[5%] text-4xl z-40"
            >
              😂
            </motion.div>

            {/* Heart */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute right-[5%] bottom-[25%] w-12 h-12 bg-gradient-to-br from-[#FF6B9D] to-[#FF8E53] rounded-full flex items-center justify-center shadow-lg z-40"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.div>

            {/* Profile Picture */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute left-[35%] bottom-0 w-[70px] h-[70px] rounded-full border-4 border-[#1877f2] overflow-hidden shadow-xl z-50 bg-gradient-to-br from-[#FF6B9D] to-[#C44569]"
            >
              <div className="w-full h-full flex items-center justify-center text-3xl">
                👩
              </div>
            </motion.div>

            {/* Story indicators */}
            <div className="absolute right-[15%] bottom-[8%] flex gap-1.5 z-40">
              <div className="w-6 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {isLogin ? (
            <Register switchToLogin={() => setIsLogin(true)} />
          ) : (
            <Login switchToRegister={() => setIsLogin(false)} />
          )}

          {/* Meta Logo */}
          <div className="mt-6 text-center">
            <svg className="w-[100px] h-[20px] mx-auto opacity-60" viewBox="0 0 100 20" fill="currentColor">
              <text x="50" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#606770">Meta</text>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

