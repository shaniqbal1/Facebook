import React, { useState } from "react";
import axios from "axios";
import Avatar from "./avater.jsx";
import CommentSection from "./commentsection.jsx";
import { HeartIcon, CommentIcon, ShareIcon, TrashIcon, MoreIcon } from "./icon.jsx";

const API = "http://localhost:8000";

// ─── PostCard ─────────────────────────────────────────────────────────────────
const PostCard = ({ post, currentUserId, onDelete }) => {
  const initialLikes = Array.isArray(post.likes) ? post.likes : [];
  const [liked, setLiked] = useState(
    currentUserId
      ? initialLikes.some((id) =>
          (typeof id === "object" ? id._id || id : id).toString() === currentUserId
        )
      : false
  );
  const [likeCount, setLikeCount] = useState(initialLikes.length);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isOwner = currentUserId && post.user?._id === currentUserId;

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleLike = async () => {
    if (likeLoading) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    setLikeLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/post/${post._id}/like`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikeCount(res.data.likeCount);
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(124,58,237,0.15)",
        borderRadius: 20, marginBottom: 20, overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={post.user?.name} profileImage={post.user?.profileImage} size={40} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#f3f4f6", lineHeight: 1.3 }}>
              {post.user?.name}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#7c3aed", lineHeight: 1.3 }}>
              @{post.user?.username} · {post.createdAt ? timeAgo(post.createdAt) : ""}
            </p>
          </div>
        </div>

        {/* More menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "none", border: "none", color: "#6b7280",
              cursor: "pointer", padding: "6px", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
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
                    fontSize: 13, transition: "background 0.15s", textAlign: "left",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <TrashIcon /> Delete post
                </button>
              )}
              <button
                onClick={() => setShowMenu(false)}
                style={{
                  width: "100%", padding: "10px 16px", background: "none",
                  border: "none", color: "#9ca3af", cursor: "pointer",
                  fontSize: 13, transition: "background 0.15s", textAlign: "left",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <p style={{ margin: "0 16px 12px", color: "#d1d5db", fontSize: 14, lineHeight: 1.6 }}>
          {post.caption}
        </p>
      )}

      {/* Image */}
      {post.image && (
        <div style={{ position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.3)", maxHeight: 520 }}>
          {!imageLoaded && (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.05)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(124,58,237,0.3)", borderTopColor: "#7c3aed", animation: "spin 0.8s linear infinite" }} />
            </div>
          )}
          <img
            src={post.image}
            alt="post"
            onLoad={() => setImageLoaded(true)}
            style={{ width: "100%", maxHeight: 520, objectFit: "cover", display: imageLoaded ? "block" : "none" }}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: liked ? "rgba(239,68,68,0.12)" : "none", border: "none",
            color: liked ? "#f87171" : "#6b7280", cursor: likeLoading ? "default" : "pointer",
            padding: "7px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500,
            transition: "all 0.2s", opacity: likeLoading ? 0.6 : 1,
          }}
        >
          <HeartIcon filled={liked} />
          {likeCount > 0 ? likeCount : ""}
        </button>

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments((s) => !s)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: showComments ? "rgba(124,58,237,0.12)" : "none", border: "none",
            color: showComments ? "#a78bfa" : "#6b7280", cursor: "pointer",
            padding: "7px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500,
            transition: "all 0.2s",
          }}
        >
          <CommentIcon />
          {post.comments?.length > 0 && post.comments.length}
        </button>

        {/* Share */}
        <button
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: "#6b7280",
            cursor: "pointer", padding: "7px 12px", borderRadius: 10,
            fontSize: 13, fontWeight: 500, transition: "color 0.2s", marginLeft: "auto",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#a78bfa"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
        >
          <ShareIcon />
        </button>
      </div>

      {/* Comment section */}
      {showComments && (
        <CommentSection post={post} currentUserId={currentUserId} />
      )}
    </div>
  );
};

export default PostCard;