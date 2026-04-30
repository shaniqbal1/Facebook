import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NexusLayout from "../component/nexusLayout.jsx";

const API = "http://localhost:8000"; // adjust to your backend URL

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CreatePost = ({ user }) => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    // Basic client-side size guard (10 MB)
    if (f.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError("");
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please select an image."); return; }
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      const res = await fetch(`${API}/api/post/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create post");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NexusLayout user={user}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        <h1 style={{ color: "#f3f4f6", fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
          Create Post
        </h1>

        {/* Drop zone / preview */}
        {!preview ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            style={{
              border: "2px dashed rgba(168,85,247,0.4)",
              borderRadius: 16,
              padding: "60px 20px",
              textAlign: "center",
              cursor: "pointer",
              color: "#6b7280",
              background: "rgba(168,85,247,0.04)",
              transition: "border-color 0.2s, background 0.2s",
              marginBottom: 20,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.7)";
              e.currentTarget.style.background = "rgba(168,85,247,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
              e.currentTarget.style.background = "rgba(168,85,247,0.04)";
            }}
          >
            <div style={{ color: "#7c3aed", marginBottom: 12 }}><UploadIcon /></div>
            <p style={{ color: "#c4b5fd", fontWeight: 600, fontSize: 15, margin: "0 0 6px" }}>
              Click or drag & drop
            </p>
            <p style={{ fontSize: 13, margin: 0 }}>PNG, JPG, WEBP up to 10 MB</p>
          </div>
        ) : (
          <div style={{ position: "relative", marginBottom: 20, borderRadius: 16, overflow: "hidden" }}>
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }}
            />
            <button
              onClick={clearImage}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(0,0,0,0.7)", border: "none",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <XIcon />
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        {/* Caption */}
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Write a caption..."
          maxLength={2200}
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(168,85,247,0.2)",
            borderRadius: 12,
            padding: "12px 14px",
            color: "#e5e7eb",
            fontSize: 14,
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.6,
            marginBottom: 8,
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.7)"}
          onBlur={e => e.target.style.borderColor = "rgba(168,85,247,0.2)"}
        />
        <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280", marginBottom: 20 }}>
          {caption.length}/2200
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, padding: "10px 14px", color: "#f87171",
            fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              background: "none", border: "1px solid rgba(168,85,247,0.3)",
              color: "#9ca3af", fontWeight: 600, fontSize: 14,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 12,
              background: loading || !file
                ? "rgba(124,58,237,0.4)"
                : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              border: "none", color: "#fff", fontWeight: 700,
              fontSize: 14, cursor: loading || !file ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Posting..." : "Share Post"}
          </button>
        </div>
      </div>
    </NexusLayout>
  );
};

export default CreatePost;