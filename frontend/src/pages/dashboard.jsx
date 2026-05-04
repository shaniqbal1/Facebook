import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NexusLayout from "../component/nexusLayout.jsx";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);

const Avatar = ({ name, profileImage, size = 38 }) => {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const colors = ["#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#8b5cf6"];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", border: "2px solid rgba(124,58,237,0.4)",
          flexShrink: 0,
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
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {initials}
    </div>
  );
};

const PostCard = ({ post, currentUserId, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 120));
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isOwner = currentUserId && post.user?._id === currentUserId;

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(124,58,237,0.15)",
      borderRadius: 20,
      marginBottom: 20,
      overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
      position: "relative",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px 12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={post.user?.name} profileImage={post.user?.profileImage} size={40} />
          <div>
            <p style={{
              margin: 0, fontWeight: 700, fontSize: 14, color: "#f3f4f6",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3,
            }}>
              {post.user?.name}
            </p>
            <p style={{
              margin: 0, fontSize: 12, color: "#7c3aed",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3,
            }}>
              @{post.user?.username} · {post.createdAt ? timeAgo(post.createdAt) : ""}
            </p>
          </div>
        </div>

        {/* More / Delete menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "none", border: "none", color: "#6b7280",
              cursor: "pointer", padding: "6px", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#d1d5db"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "none"; }}
          >
            <MoreIcon />
          </button>

          {showMenu && (
            <div style={{
              position: "absolute", right: 0, top: 36, zIndex: 10,
              background: "#1a1a2e", border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 12, overflow: "hidden", minWidth: 140,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}>
              {isOwner && (
                <button
                  onClick={() => { setShowMenu(false); onDelete(post._id); }}
                  style={{
                    width: "100%", padding: "10px 16px", background: "none",
                    border: "none", color: "#f87171", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <TrashIcon /> Delete post
                </button>
              )}
              <button
                onClick={() => setShowMenu(false)}
                style={{
                  width: "100%", padding: "10px 16px", background: "none",
                  border: "none", color: "#9ca3af", cursor: "pointer",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s", textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Caption above image */}
      {post.caption && (
        <p style={{
          margin: "0 16px 12px",
          color: "#d1d5db", fontSize: 14, lineHeight: 1.6,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {post.caption}
        </p>
      )}

      {/* Image */}
      {post.image && (
        <div style={{
          position: "relative", overflow: "hidden",
          background: "rgba(0,0,0,0.3)",
          maxHeight: 520,
        }}>
          {!imageLoaded && (
            <div style={{
              height: 300, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(124,58,237,0.05)",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "2px solid rgba(124,58,237,0.3)",
                borderTopColor: "#7c3aed",
                animation: "spin 0.8s linear infinite",
              }} />
            </div>
          )}
          <img
            src={post.image}
            alt="post"
            onLoad={() => setImageLoaded(true)}
            style={{
              width: "100%",
              maxHeight: 520,
              objectFit: "cover",
              display: imageLoaded ? "block" : "none",
              transition: "opacity 0.3s",
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "10px 12px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <button
          onClick={() => { setLiked(!liked); setLikeCount(c => liked ? c - 1 : c + 1); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: liked ? "rgba(239,68,68,0.1)" : "none",
            border: "none",
            color: liked ? "#f87171" : "#6b7280",
            cursor: "pointer", padding: "7px 12px", borderRadius: 10,
            fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => !liked && (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={e => !liked && (e.currentTarget.style.color = "#6b7280")}
        >
          <HeartIcon /> {likeCount}
        </button>

        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", color: "#6b7280",
          cursor: "pointer", padding: "7px 12px", borderRadius: 10,
          fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          transition: "color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "#a78bfa"}
          onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
        >
          <CommentIcon /> Comment
        </button>

        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", color: "#6b7280",
          cursor: "pointer", padding: "7px 12px", borderRadius: 10,
          fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          transition: "color 0.2s", marginLeft: "auto",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "#a78bfa"}
          onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) { navigate("/login"); return; }

    const decoded = decodeToken(storedToken);
    if (decoded?.id) setCurrentUserId(decoded.id);

    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/post/all");
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <NexusLayout user={user}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .post-card-anim {
          animation: fadeUp 0.4s ease both;
        }
      `}</style>

      <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 40 }}>

        {/* Feed header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            color: "#f3f4f6", fontWeight: 700, fontSize: 20, margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Home Feed
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
            Latest posts from everyone
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(124,58,237,0.1)",
                borderRadius: 20, padding: 16, height: 320,
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "#4b5563", fontFamily: "'DM Sans', sans-serif",
          }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>✦</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>No posts yet</p>
            <p style={{ fontSize: 13, margin: 0 }}>Be the first to share something</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div
              key={post._id}
              className="post-card-anim"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <PostCard
                post={post}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            </div>
          ))
        )}
      </div>
    </NexusLayout>
  );
};

export default Dashboard;