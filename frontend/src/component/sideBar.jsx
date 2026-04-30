
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Icons ───────────────────────────────────────────────────────────────────
const HomeIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ReelsIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);
const ExploreIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={filled ? "white" : "none"} />
  </svg>
);
const BellIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const MessageIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ProfileIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const SettingsIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Home",          path: "/dashboard",    Icon: HomeIcon },
  { label: "Reels",         path: "/reels",         Icon: ReelsIcon },
  { label: "Explore",       path: "/explore",       Icon: ExploreIcon },
  { label: "Notifications", path: "/notifications", Icon: BellIcon,    badge: 3 },
  { label: "Messages",      path: "/messages",      Icon: MessageIcon },
  { label: "Bookmarks",     path: "/bookmarks",     Icon: BookmarkIcon },
  { label: "Profile",       path: "/profile",       Icon: ProfileIcon },
  { label: "Settings",      path: "/settings",      Icon: SettingsIcon },
];

// Bottom tab items (most important 5 for mobile)
const BOTTOM_TABS = [
  { label: "Home",    path: "/dashboard",    Icon: HomeIcon },
  { label: "Explore", path: "/explore",      Icon: ExploreIcon },
  { label: "Reels",   path: "/reels",        Icon: ReelsIcon },
  { label: "Notifs",  path: "/notifications",Icon: BellIcon, badge: 3 },
  { label: "Profile", path: "/profile",      Icon: ProfileIcon },
];

const NavItem = ({ label, path, Icon, badge, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200
      ${isActive
        ? "bg-purple-600/30 text-purple-300 border border-purple-500/25"
        : "text-gray-400 hover:bg-purple-800/50 hover:text-purple-200"}`}
  >
    <span><Icon filled={isActive} /></span>
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="bg-purple-700 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">
        {badge}
      </span>
    )}
  </div>
);

const Sidebar = ({ user = { name: "...", username: "...", avatar: null } }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex fixed top-16 left-0 bottom-0 w-60 bg-[#0d0b18] border-r border-purple-500/15 p-4 flex-col overflow-y-auto z-40">
        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV_ITEMS.slice(0, 3).map(({ label, path, Icon, badge }) => (
            <NavItem key={path} label={label} path={path} Icon={Icon} badge={badge}
              isActive={location.pathname === path} onClick={() => navigate(path)} />
          ))}

          <div className="my-3 border-t border-white/10" />

          {NAV_ITEMS.slice(3, 6).map(({ label, path, Icon, badge }) => (
            <NavItem key={path} label={label} path={path} Icon={Icon} badge={badge}
              isActive={location.pathname === path} onClick={() => navigate(path)} />
          ))}

          <div className="my-3 border-t border-white/10" />

          {NAV_ITEMS.slice(6).map(({ label, path, Icon, badge }) => (
            <NavItem key={path} label={label} path={path} Icon={Icon} badge={badge}
              isActive={location.pathname === path} onClick={() => navigate(path)} />
          ))}
        </nav>

        {/* Create Post button */}
        <button
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm hover:opacity-90 transition-all mt-4 w-full"
          onClick={() => navigate("/create")}
        >
          <PlusIcon />
          Create Post
        </button>

        {/* User card */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl bg-purple-900/20 mt-4 cursor-pointer hover:bg-purple-900/35 transition-all"
          onClick={() => navigate("/profile")}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-lg" />
              : (user.name && user.name !== "..." ? user.name[0].toUpperCase() : "?")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user.name}</div>
            <div className="text-xs text-gray-400 truncate">@{user.username}</div>
          </div>
          <span className="text-gray-500 text-lg leading-none">···</span>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar (visible only on mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-purple-500/20 flex items-center justify-around px-2 h-16">
        {BOTTOM_TABS.map(({ label, path, Icon, badge }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all relative
                ${isActive ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Icon filled={isActive} />
              <span className="text-[10px] font-medium">{label}</span>
              {badge && (
                <span className="absolute top-1 right-[calc(50%-16px)] w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;