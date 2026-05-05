import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./avater.jsx";
import { useUser } from "../../context/userContext.jsx";

const API = "http://localhost:8000";

const typeLabel = {
  like: "liked your post",
  comment: "commented on your post",
  reply: "replied to your comment",
};

const typeIcon = {
  like: "❤️",
  comment: "💬",
  reply: "↩️",
};

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { markNotificationsRead, setUnreadCount } = useUser();

  useEffect(() => {
    const fetchAndMark = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      // Mark all read after opening panel
      await markNotificationsRead();
      setUnreadCount(0);
    };

    fetchAndMark();
  }, []);

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        height: "100vh", width: 360,
        background: "#0f0f1a",
        borderLeft: "1px solid rgba(124,58,237,0.2)",
        zIndex: 1000,
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
        animation: "slideIn 0.25s ease",
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(124,58,237,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, color: "#f3f4f6", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            🔔 Notifications
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "none",
              color: "#9ca3af", cursor: "pointer", fontSize: 18,
              width: 32, height: 32, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            ×
          </button>
        </div>

        {/* Notification list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "2px solid rgba(124,58,237,0.3)",
                borderTopColor: "#7c3aed",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6b7280", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔕</div>
              <p style={{ margin: 0, fontSize: 14 }}>No notifications yet</p>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#4b5563" }}>
                When someone likes or comments on your posts, you'll see it here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 20px",
                  background: n.isRead ? "transparent" : "rgba(124,58,237,0.07)",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(124,58,237,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = n.isRead ? "transparent" : "rgba(124,58,237,0.07)"}
              >
                {/* Avatar + type badge */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Avatar
                    name={n.sender?.name}
                    profileImage={n.sender?.profileImage}
                    size={42}
                  />
                  <span style={{
                    position: "absolute", bottom: -3, right: -5,
                    fontSize: 15, lineHeight: 1,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                  }}>
                    {typeIcon[n.type]}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>
                    <span style={{ color: "#c4b5fd", fontWeight: 700 }}>
                      {n.sender?.name}
                    </span>{" "}
                    {typeLabel[n.type]}
                  </p>
                  {n.commentText && (
                    <p style={{
                      margin: "4px 0 0", fontSize: 12, color: "#9ca3af",
                      background: "rgba(255,255,255,0.04)", borderRadius: 6,
                      padding: "4px 8px", borderLeft: "2px solid rgba(124,58,237,0.4)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      "{n.commentText.length > 55 ? n.commentText.slice(0, 55) + "…" : n.commentText}"
                    </p>
                  )}
                  <p style={{ margin: "5px 0 0", fontSize: 11, color: "#4b5563" }}>
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                {/* Post thumbnail */}
                {n.post?.image && (
                  <img
                    src={n.post.image}
                    alt="post"
                    style={{
                      width: 46, height: 46, borderRadius: 8,
                      objectFit: "cover", flexShrink: 0,
                      border: "1px solid rgba(124,58,237,0.25)",
                    }}
                  />
                )}

                {/* Unread dot */}
                {!n.isRead && (
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#7c3aed", flexShrink: 0,
                    marginTop: 6, alignSelf: "flex-start",
                  }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;