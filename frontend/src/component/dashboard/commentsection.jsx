import React, { useState, useRef } from "react";
import axios from "axios";
import Avatar from "./avater.jsx";
import { TrashIcon, SendIcon } from "./icon.jsx";

const API = "http://localhost:8000";

// ─── ReplyBox ─────────────────────────────────────────────────────────────────
const ReplyBox = ({ postId, commentId, onReplySent, onCancel }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await axios.post(
        `${API}/api/post/${postId}/comment/${commentId}/reply`,
        { text: text.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onReplySent(res.data);
      setText("");
      onCancel();
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingLeft: 36 }}>
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Write a reply..."
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 20,
          padding: "6px 14px",
          color: "#e5e7eb",
          fontSize: 12,
          outline: "none",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={(e) => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
        onBlur={(e) => e.target.style.borderColor = "rgba(124,58,237,0.3)"}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        style={{
          background: text.trim() ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(124,58,237,0.2)",
          border: "none", borderRadius: "50%",
          width: 30, height: 30,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", cursor: text.trim() ? "pointer" : "not-allowed",
          flexShrink: 0,
        }}
      >
        <SendIcon />
      </button>
      <button
        onClick={onCancel}
        style={{
          background: "none", border: "none",
          color: "#6b7280", cursor: "pointer",
          fontSize: 12, padding: "4px 6px", borderRadius: 6,
        }}
      >
        Cancel
      </button>
    </div>
  );
};

// ─── CommentItem ──────────────────────────────────────────────────────────────
const CommentItem = ({ comment, postId, currentUserId, onDelete }) => {
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleReplySent = (updatedComment) => {
    setReplies(updatedComment.replies || []);
    setShowReplies(true);
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(
        `${API}/api/post/${postId}/comment/${comment._id}/reply/${replyId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setReplies((prev) => prev.filter((r) => r._id !== replyId));
    } catch (err) {
      console.error("Delete reply failed:", err);
    }
  };

  return (
    <div>
      {/* Main comment */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <Avatar name={comment.user?.name} profileImage={comment.user?.profileImage} size={28} />
        <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "6px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#c4b5fd", fontWeight: 600, fontSize: 12 }}>
              {comment.user?.name ?? "Unknown"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#4b5563", fontSize: 11 }}>
                {comment.createdAt ? timeAgo(comment.createdAt) : ""}
              </span>
              {currentUserId && comment.user?._id === currentUserId && (
                <button
                  onClick={() => onDelete(comment._id)}
                  style={{
                    background: "none", border: "none", color: "#6b7280",
                    cursor: "pointer", padding: 2, display: "flex",
                    alignItems: "center", borderRadius: 4, transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>
          <p style={{ margin: "2px 0 0", color: "#d1d5db", fontSize: 13, lineHeight: 1.5 }}>
            {comment.text}
          </p>
        </div>
      </div>

      {/* Reply / View replies row */}
      <div style={{ paddingLeft: 36, marginTop: 4, display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={() => setShowReplyBox((s) => !s)}
          style={{
            background: "none", border: "none",
            color: "#7c3aed", fontSize: 12,
            cursor: "pointer", fontWeight: 600, padding: 0,
          }}
        >
          Reply
        </button>
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies((s) => !s)}
            style={{
              background: "none", border: "none",
              color: "#6b7280", fontSize: 12,
              cursor: "pointer", padding: 0,
            }}
          >
            {showReplies ? "Hide" : `View ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`}
          </button>
        )}
      </div>

      {/* Reply input */}
      {showReplyBox && (
        <ReplyBox
          postId={postId}
          commentId={comment._id}
          onReplySent={handleReplySent}
          onCancel={() => setShowReplyBox(false)}
        />
      )}

      {/* Replies list */}
      {showReplies && replies.length > 0 && (
        <div style={{ paddingLeft: 36, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          {replies.map((r) => (
            <div key={r._id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Avatar name={r.user?.name} profileImage={r.user?.profileImage} size={24} />
              <div style={{ flex: 1, background: "rgba(124,58,237,0.06)", borderRadius: 10, padding: "5px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#a78bfa", fontWeight: 600, fontSize: 11 }}>
                    {r.user?.name ?? "Unknown"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#4b5563", fontSize: 10 }}>
                      {r.createdAt ? timeAgo(r.createdAt) : ""}
                    </span>
                    {currentUserId && r.user?._id === currentUserId && (
                      <button
                        onClick={() => handleDeleteReply(r._id)}
                        style={{
                          background: "none", border: "none", color: "#6b7280",
                          cursor: "pointer", padding: 2, display: "flex",
                          alignItems: "center", borderRadius: 4,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ margin: "2px 0 0", color: "#d1d5db", fontSize: 12, lineHeight: 1.5 }}>
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── CommentSection ───────────────────────────────────────────────────────────
const CommentSection = ({ post, currentUserId }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef();

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await axios.post(
        `${API}/api/post/${post._id}/comment`,
        { text: text.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API}/api/post/${post._id}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };

  return (
    <div style={{
      borderTop: "1px solid rgba(124,58,237,0.12)",
      padding: "12px 16px",
      background: "rgba(0,0,0,0.15)",
    }}>
      {/* Comment list */}
      {comments.length > 0 && (
        <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              postId={post._id}
              currentUserId={currentUserId}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}

      {/* Comment input */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Write a comment..."
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 20, padding: "7px 14px",
            color: "#e5e7eb", fontSize: 13, outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(124,58,237,0.2)"}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          style={{
            background: text.trim() ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(124,58,237,0.2)",
            border: "none", borderRadius: "50%",
            width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", cursor: text.trim() ? "pointer" : "not-allowed",
            transition: "background 0.2s", flexShrink: 0,
          }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;