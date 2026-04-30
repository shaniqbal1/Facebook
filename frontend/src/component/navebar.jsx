import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Icons ───────────────────────────────────────────────────────────────────
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Navbar = ({ user = { name: "...", username: "...", avatar: null } }) => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifCount] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-lg border-b border-purple-500/20">

      {/* ── Main bar ── */}
      <div className="h-16 flex items-center px-4 md:px-6 gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/dashboard")}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white shadow-lg">
            <BoltIcon />
          </div>
          <span className="text-white text-lg font-extrabold tracking-tight">Nexus</span>
        </div>

        {/* Search bar — desktop only */}
        <div className="relative flex-1 max-w-lg mx-auto hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            className="w-full h-9 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-gray-300 text-sm font-medium focus:bg-purple-950/40 focus:border-purple-500 focus:outline-none transition-all duration-200"
            placeholder="Search for people, posts, reels..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </div>

        {/* Push right actions to end on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {/* Mobile search toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-xl border border-white/10 text-gray-400 flex items-center justify-center hover:bg-purple-900/40 hover:text-purple-400 transition-all"
            onClick={() => setMobileSearchOpen(o => !o)}
          >
            <SearchIcon />
          </button>

          {/* Notifications */}
          <div
            className="relative w-9 h-9 rounded-xl border border-white/10 text-gray-400 flex items-center justify-center cursor-pointer hover:bg-purple-900/40 hover:text-purple-400 transition-all"
            onClick={() => navigate("/notifications")}
          >
            <BellIcon />
            {notifCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-black">
                {notifCount}
              </span>
            )}
          </div>

          {/* Messages — hidden on xs, shown sm+ */}
          <div
            className="hidden sm:flex w-9 h-9 rounded-xl border border-white/10 text-gray-400 items-center justify-center cursor-pointer hover:bg-purple-900/40 hover:text-purple-400 transition-all"
            onClick={() => navigate("/messages")}
          >
            <MessageIcon />
          </div>

          {/* Create Post — icon-only on mobile */}
          <button
            className="flex items-center gap-1.5 h-9 px-2 md:px-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white font-semibold text-sm border-none cursor-pointer hover:opacity-90 transition-all shadow-lg"
            onClick={() => navigate("/create")}
          >
            <PlusIcon />
            <span className="hidden md:inline">Create Post</span>
          </button>

          {/* Avatar / dropdown */}
          <div className="relative">
            <div
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-white/10 cursor-pointer transition-all hover:bg-purple-900/40 ${dropdownOpen ? "bg-purple-900/40" : ""}`}
              onClick={() => setDropdownOpen(o => !o)}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden flex-shrink-0">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : (user.name && user.name !== "..." ? user.name[0].toUpperCase() : "?")}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-gray-300">
                {user.name && user.name !== "..." ? user.name.split(" ")[0] : "..."}
              </span>
              <span className="text-gray-400 hidden sm:inline"><ChevronDown /></span>
            </div>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-purple-500/30 rounded-xl py-2 px-2 shadow-2xl z-50">
                <div onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-purple-900/60 hover:text-white cursor-pointer rounded-lg transition-all text-sm">
                  👤 Profile
                </div>
                <div onClick={() => { navigate("/bookmarks"); setDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-purple-900/60 hover:text-white cursor-pointer rounded-lg transition-all text-sm">
                  🔖 Bookmarks
                </div>
                <div onClick={() => { navigate("/settings"); setDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-purple-900/60 hover:text-white cursor-pointer rounded-lg transition-all text-sm">
                  ⚙️ Settings
                </div>
                <div className="h-px bg-white/10 my-1.5" />
                <div onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/40 hover:text-red-300 cursor-pointer rounded-lg transition-all text-sm">
                  🚪 Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile search dropdown ── */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-white/5 pt-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              autoFocus
              className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-gray-300 text-sm focus:border-purple-500 focus:outline-none transition-all"
              placeholder="Search..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 