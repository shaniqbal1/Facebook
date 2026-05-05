import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NexusLayout from "./nexusLayout.jsx";
import PostCard from "../component/dashboard/post.jsx";

const API = "http://localhost:8000";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
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

    axios.get(`${API}/api/post/all`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error loading posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch {
      alert("Failed to delete post.");
    }
  };

  return (
    <NexusLayout user={user}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .post-anim { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div style={{ maxWidth: 600, margin: "0", paddingBottom: 40 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: "#f3f4f6", fontWeight: 700, fontSize: 20, margin: 0 }}>Home Feed</h2>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 0" }}>Latest posts from everyone</p>
        </div>

        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.1)",
              borderRadius: 20, marginBottom: 20, height: 320,
            }} />
          ))
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#4b5563" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>✦</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>No posts yet</p>
            <p style={{ fontSize: 13, margin: 0 }}>Be the first to share something</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post._id} className="post-anim" style={{ animationDelay: `${i * 0.06}s` }}>
              <PostCard post={post} currentUserId={currentUserId} onDelete={handleDelete} />
            </div>
          ))
        )}
      </div>
    </NexusLayout>
  );
};

export default Dashboard;