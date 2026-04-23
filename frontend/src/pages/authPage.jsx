import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./login";
import Register from "./register";

/* ─── Floating ambient orb ─────────────────────────────────────────────────── */
const Orb = ({ className, duration }) => (
  <motion.div
    aria-hidden="true"
    animate={{ x: [0, 22, -14, 8, 0], y: [0, -32, 18, -8, 0], scale: [1, 1.08, 0.96, 1.04, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full pointer-events-none opacity-50 blur-[72px] ${className}`}
  />
);

/* ─── Rotating tagline ──────────────────────────────────────────────────────── */
const taglines = [
  "Connect with people you love.",
  "Share moments that matter.",
  "Build communities that last.",
  "Discover what moves you.",
];

function RotatingTagline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % taglines.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-[52px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="m-0 text-lg text-white/60 leading-relaxed"
        >
          {taglines[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ─── Avatar stack ──────────────────────────────────────────────────────────── */
const avatars = [
  { initials: "AK", bg: "bg-indigo-500" },
  { initials: "MR", bg: "bg-violet-500" },
  { initials: "JS", bg: "bg-pink-500" },
  { initials: "TN", bg: "bg-cyan-500" },
  { initials: "OP", bg: "bg-amber-500" },
];

function AvatarStack() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      className="inline-flex items-center gap-3 bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-full py-2 pl-2 pr-4"
    >
      <div className="flex">
        {avatars.map((a, i) => (
          <div
            key={i}
            className={`w-[30px] h-[30px] rounded-full ${a.bg} border-2 border-[#0a0918] flex items-center justify-center text-[10px] font-bold text-white relative`}
            style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: avatars.length - i }}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <span className="text-[13px] text-white/60">
        128k+ people joined this week
      </span>
    </motion.div>
  );
}

/* ─── Left branding panel ───────────────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div
      className="flex-1 relative overflow-hidden flex flex-col justify-between p-12 min-h-screen"
      style={{ background: "linear-gradient(145deg, #0d0b1e 0%, #1a1040 50%, #0d1829 100%)" }}
    >
      <Orb className="w-[340px] h-[340px] bg-indigo-600 -top-20 -left-20" duration={14} />
      <Orb className="w-[280px] h-[280px] bg-violet-700 bottom-[15%] -right-16" duration={11} />
      <Orb className="w-[200px] h-[200px] bg-cyan-600 bottom-[35%] left-[10%]" duration={17} />
      <Orb className="w-[160px] h-[160px] bg-pink-600 top-[42%] right-[20%]" duration={9} />

      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
          </svg>
        </div>
        <span className="text-white text-2xl font-extrabold tracking-tight">
          Nexus
        </span>
      </motion.div>

      {/* Center block */}
      <div className="relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-block bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full px-4 py-1 text-[11px] font-semibold text-white tracking-widest uppercase mb-5"
        >
          Now in public beta
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 22 }}
          className="m-0 mb-4 font-extrabold leading-tight text-[clamp(30px,3.5vw,46px)]"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your world,<br />beautifully connected.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-10"
        >
          <RotatingTagline />
        </motion.div>

        <AvatarStack />
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 flex gap-5 items-center"
      >
        {["Privacy", "Terms", "Help"].map((t) => (
          <span key={t} className="text-white/25 text-xs cursor-pointer hover:text-white/50 transition-colors">
            {t}
          </span>
        ))}
        <span className="text-white/15 text-xs ml-auto">© 2025 Nexus Inc.</span>
      </motion.div>
    </div>
  );
}

/* ─── Tab switcher ──────────────────────────────────────────────────────────── */
function TabSwitcher({ isLogin, onSwitch }) {
  return (
    <div className="flex bg-white/5 border border-white/[0.09] rounded-2xl p-1 mb-8">
      {[{ label: "Sign in", value: true }, { label: "Sign up", value: false }].map(({ label, value }) => (
        <motion.button
          key={label}
          type="button"
          onClick={() => onSwitch(value)}
          className={`flex-1 py-[10px] rounded-xl text-sm font-semibold border-none cursor-pointer relative z-10 transition-colors duration-200 ${
            isLogin === value ? "text-white" : "text-white/35 bg-transparent"
          }`}
        >
          {isLogin === value && (
            <motion.div
              layoutId="auth-tab-bg"
              className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          {label}
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Main AuthPage ─────────────────────────────────────────────────────────── */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (document.getElementById("nexus-fonts")) return;
    const link = document.createElement("link");
    link.id = "nexus-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0a0918]">

      {/* Left panel — hidden below lg breakpoint */}
      <div className="hidden lg:flex lg:flex-[0_0_52%]">
        <LeftPanel />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0918] relative overflow-hidden min-h-screen">

        {/* Soft radial glow */}
        <div
          aria-hidden="true"
          className="absolute w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
        />

        <div className="w-full max-w-[420px] relative z-10">

          <TabSwitcher isLogin={isLogin} onSwitch={(v) => setIsLogin(v)} />

          {/* Animated heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-head" : "reg-head"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="mb-6"
            >
              <h2 className="m-0 font-bold text-[22px] text-slate-50 tracking-tight">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 mb-0 text-sm text-white/40">
                {isLogin
                  ? "Sign in to continue where you left off"
                  : "Join 128,000+ people already on Nexus"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -28 : 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: isLogin ? 28 : -28, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {isLogin
                ? <Login switchToRegister={() => setIsLogin(false)} />
                : <Register switchToLogin={() => setIsLogin(true)} />
              }
            </motion.div>
          </AnimatePresence>

          <p className="text-center mt-8 text-[11px] text-white/20 tracking-[0.12em]">
            NEXUS · A META COMPANY
          </p>
        </div>
      </div>

      {/*
        ── Dark-theme overrides for your Login / Register components ──
        These re-skin your existing Tailwind classes without touching
        login.jsx or register.jsx at all.
      */}
      <style>{`
        /* Card shell */
        .bg-white       { background-color: rgba(255,255,255,0.04) !important; }
        .shadow-lg      { box-shadow: 0 24px 64px rgba(0,0,0,0.5) !important; }
        .rounded-lg     { border-radius: 16px !important;
                          border: 1px solid rgba(255,255,255,0.08) !important; }

        /* Text inputs */
        .border.rounded {
          background : rgba(255,255,255,0.05) !important;
          border     : 1px solid rgba(255,255,255,0.1) !important;
          border-radius : 10px !important;
          color      : #f8fafc !important;
          transition : border-color .2s, box-shadow .2s !important;
        }
        .border.rounded:focus {
          outline    : none !important;
          border-color : #6366f1 !important;
          box-shadow : 0 0 0 3px rgba(99,102,241,0.2) !important;
        }
        .border.rounded::placeholder { color: rgba(255,255,255,0.3) !important; }

        /* Submit button */
        .bg-blue-500 {
          background : linear-gradient(135deg,#6366f1,#8b5cf6) !important;
          border     : none !important;
          border-radius : 10px !important;
          font-weight : 600 !important;
          letter-spacing : 0.02em !important;
          transition : transform .15s, box-shadow .15s !important;
        }
        .bg-blue-500:hover {
          transform  : translateY(-1px) !important;
          box-shadow : 0 8px 24px rgba(99,102,241,0.4) !important;
        }

        /* Text links */
        .text-blue-500       { color: #818cf8 !important; font-weight: 600 !important; }
        .text-blue-500:hover { color: #a5b4fc !important; }

        /* Success alert */
        .bg-green-100  { background: rgba(52,211,153,0.1) !important;
                         border: 1px solid rgba(52,211,153,0.25) !important;
                         border-radius: 8px !important; }
        .text-green-700 { color: #34d399 !important; }

        /* Error alert */
        .bg-red-100    { background: rgba(248,113,113,0.1) !important;
                         border: 1px solid rgba(248,113,113,0.25) !important;
                         border-radius: 8px !important; }
        .text-red-600  { color: #f87171 !important; }

        /* Bottom divider inside card */
        .text-center.py-4 { border-top: 1px solid rgba(255,255,255,0.06) !important; }
      `}</style>
    </div>
  );
};

export default AuthPage;