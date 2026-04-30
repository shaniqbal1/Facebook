import React, { useEffect, useState } from "react";
import NexusLayout from "../component/NexusLayout.jsx";

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20"
    fill={filled ? "#a855f7" : "none"} stroke={filled ? "#a855f7" : "currentColor"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20"
    fill={filled ? "#a855f7" : "none"} stroke={filled ? "#a855f7" : "currentColor"} strokeWidth="2">
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const API = "http://localhost:8000";

// ─── PostCard ─────────────────────────────────────────────────────────────────
const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);

  const handleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const avatar = post.user?.profileImage;
  const username = post.user?.username ?? "unknown";
  const initials = username[0]?.toUpperCase() ?? "?";

  // Build full image URL — backend serves from /uploads
  const imageUrl = post.image
    ? (post.image.startsWith("http") ? post.image : `${API}/${post.image.replace(/\\/g, "/")}`)
    : null;

  return (
    <article style={{
      background: "#12101f",
      border: "1px solid rgba(168,85,247,0.15)",
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 20,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0, overflow: "hidden",
          background: "linear-gradient(135deg,#7c3aed,#db2777)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 600, fontSize: 15,
        }}>
          {avatar
            ? <img src={avatar.startsWith("http") ? avatar : `${API}/${avatar}`}
                alt={username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#f3f4f6", fontWeight: 600, fontSize: 14 }}>@{username}</div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>{timeAgo(post.createdAt)}</div>
        </div>
        <button style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 4 }}>
          <MoreIcon />
        </button>
      </div>

      {/* Image */}
      {imageUrl && (
        <div style={{ width: "100%", background: "#0a0814", lineHeight: 0 }}>
          <img
            src={imageUrl}
            alt={post.caption ?? "post"}
            style={{ width: "100%", maxHeight: 520, objectFit: "cover", display: "block" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: "12px 16px 4px", display: "flex", alignItems: "center", gap: 4 }}>
        <button onClick={handleLike} style={{
          background: "none", border: "none", cursor: "pointer", padding: "6px 8px",
          color: liked ? "#a855f7" : "#9ca3af", display: "flex", alignItems: "center", gap: 5,
          fontSize: 13, borderRadius: 8, transition: "background 0.15s",
        }}>
          <HeartIcon filled={liked} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>

        <button style={{
          background: "none", border: "none", cursor: "pointer", padding: "6px 8px",
          color: "#9ca3af", display: "flex", alignItems: "center", gap: 5, fontSize: 13, borderRadius: 8,
        }}>
          <CommentIcon />
        </button>

        <button style={{
          background: "none", border: "none", cursor: "pointer", padding: "6px 8px",
          color: "#9ca3af", display: "flex", alignItems: "center", gap: 5, fontSize: 13, borderRadius: 8,
        }}>
          <ShareIcon />
        </button>

        <div style={{ flex: 1 }} />

        <button onClick={() => setSaved(s => !s)} style={{
          background: "none", border: "none", cursor: "pointer", padding: "6px 8px",
          color: saved ? "#a855f7" : "#9ca3af", borderRadius: 8,
        }}>
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div style={{ padding: "4px 16px 14px", color: "#d1d5db", fontSize: 14, lineHeight: 1.5 }}>
          <span style={{ color: "#c4b5fd", fontWeight: 600, marginRight: 6 }}>@{username}</span>
          {post.caption}
        </div>
      )}
    </article>
  );
};

// ─── PostSkeleton (loading placeholder) ──────────────────────────────────────
const Skeleton = ({ style }) => (
  <div style={{
    background: "rgba(168,85,247,0.08)",
    borderRadius: 8,
    animation: "pulse 1.5s ease-in-out infinite",
    ...style,
  }} />
);

const PostSkeleton = () => (
  <div style={{
    background: "#12101f", border: "1px solid rgba(168,85,247,0.15)",
    borderRadius: 16, overflow: "hidden", marginBottom: 20, padding: 16,
  }}>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      <Skeleton style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <Skeleton style={{ height: 13, width: "40%", marginBottom: 6 }} />
        <Skeleton style={{ height: 11, width: "25%" }} />
      </div>
    </div>
    <Skeleton style={{ height: 300, borderRadius: 10, marginBottom: 12 }} />
    <Skeleton style={{ height: 13, width: "70%" }} />
  </div>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API}/api/post/all`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <NexusLayout user={user}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {loading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12, padding: "16px 20px", color: "#f87171", fontSize: 14, textAlign: "center",
          }}>
            Could not load posts — {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "#6b7280",
          }}>
            <div style={{ color: "#4b5563", marginBottom: 12 }}><ImageIcon /></div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px" }}>No posts yet</p>
            <p style={{ fontSize: 14, margin: 0 }}>Be the first to share something!</p>
          </div>
        )}

        {!loading && posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </NexusLayout>
  );
};

export default Home;