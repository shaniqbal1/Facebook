import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // =========================
    // 1. HANDLE TOKEN (Google login)
    // =========================
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
    }

    // redirect if no token
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    // =========================
    // 2. FETCH POSTS
    // =========================
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/post/all"
        );

        setPosts(res.data);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-6">
        Welcome to Nexus 👋
      </h1>

      {/* =========================
          FEED SECTION
      ========================= */}
      <div>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              style={{
                marginBottom: "20px",
                border: "1px solid #333",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>
                {post.user?.username}
              </h4>

              <img
                src={`http://localhost:8000/${post.image}`}
                alt="post"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "10px",
                }}
              />

              <p style={{ marginTop: "10px" }}>
                {post.caption}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;