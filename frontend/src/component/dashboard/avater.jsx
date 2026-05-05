import React from "react";

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, profileImage, size = 38 }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const colors = ["#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#8b5cf6"];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", border: "2px solid rgba(124,58,237,0.4)", flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, #a855f7)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff",
      flexShrink: 0, border: "2px solid rgba(124,58,237,0.4)",
    }}>
      {initials}
    </div>
  );
};

export default Avatar;