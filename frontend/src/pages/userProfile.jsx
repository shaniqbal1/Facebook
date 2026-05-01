import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "../context/userContext.jsx"; // ✅ FIX 1: import context

const Profile = () => {
  const { setUser: setContextUser } = useUser(); // ✅ FIX 2: grab context setter (renamed to avoid clash)

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [imgError, setImgError] = useState("");

  const [formData, setFormData] = useState({ name: "", bio: "", dateOfBirth: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || "",
          bio: res.data.user.bio || "",
          dateOfBirth: res.data.user.dateOfBirth ? res.data.user.dateOfBirth.split("T")[0] : "",
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:8000/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setContextUser(res.data.user); // ✅ FIX 3: update context → Navbar + Sidebar re-render
      setFormData({
        name: res.data.user.name || "",
        bio: res.data.user.bio || "",
        dateOfBirth: res.data.user.dateOfBirth ? res.data.user.dateOfBirth.split("T")[0] : "",
      });
      setEditing(false);
      setSaveMsg("Profile updated!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("Failed to save.");
      setTimeout(() => setSaveMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) { fileInputRef.current.value = ""; fileInputRef.current.click(); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      setImgError("Image must be under 1MB.");
      setTimeout(() => setImgError(""), 3000);
      return;
    }
    try {
      setUploadingImg(true);
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("profileImage", file);
      const res = await axios.put("http://localhost:8000/api/user/profile", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setUser(prev => ({ ...prev, profileImage: res.data.user.profileImage }));
      setContextUser(prev => ({ ...prev, profileImage: res.data.user.profileImage })); // ✅ FIX 4: update context → avatar in Navbar + Sidebar updates instantly
    } catch (err) {
      setImgError(err.response?.status === 413 ? "Image too large. Max 1MB." : err.response?.data?.message || "Upload failed.");
      setTimeout(() => setImgError(""), 3000);
    } finally {
      setUploadingImg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <div className="w-9 h-9 rounded-full border-[3px] border-purple-900 border-t-purple-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start relative">

      {/* Background blobs */}
      <div className="fixed -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-800/20 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 right-[10%] w-[400px] h-[400px] rounded-full bg-pink-700/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-[#13131a] border border-white/[0.07] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-4 sm:gap-6">

          {/* Avatar + name row on mobile */}
          <div className="flex items-center gap-4 sm:contents">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
                onClick={openFilePicker}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[3px] border-purple-600 cursor-pointer hover:opacity-75 transition-opacity"
              />
              <button
                type="button"
                onClick={openFilePicker}
                className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-purple-600 border-2 border-[#13131a] flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
              >
                {uploadingImg
                  ? <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : <CameraIcon />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {imgError && (
                <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-red-500">{imgError}</p>
              )}
            </div>

            {/* Name / username / email */}
            <div className="flex-1 min-w-0 sm:min-w-[160px]">
              {editing ? (
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-[#1e1e2a] border border-purple-600/50 rounded-xl px-4 py-2 text-white text-lg font-bold outline-none focus:border-purple-500 transition-colors"
                />
              ) : (
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">{user.name}</h1>
              )}
              <p className="mt-1 text-sm text-purple-400">@{user.username}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
            </div>
          </div>

          {/* Edit / Save / Cancel */}
          <div className="flex flex-col gap-2 sm:ml-auto w-full sm:w-auto">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 sm:flex-none px-5 py-2 bg-transparent border border-white/10 hover:border-white/20 text-gray-400 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            )}
            {saveMsg && <p className="text-xs text-purple-400 text-center sm:text-right">{saveMsg}</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 sm:my-6 border-t border-white/[0.07]" />

        {/* ── BIO ── */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">Bio</label>
          {editing ? (
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell people about yourself…"
              rows={4}
              className="w-full bg-[#1e1e2a] border border-purple-600/50 rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed outline-none focus:border-purple-500 resize-y transition-colors font-sans"
            />
          ) : (
            <p className="text-gray-400 text-sm leading-relaxed">
              {user.bio || <span className="text-gray-600 italic">No bio added yet.</span>}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 sm:my-6 border-t border-white/[0.07]" />

        {/* ── DETAILS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Date of Birth */}
          <div className="bg-[#1a1a24] border border-white/[0.05] rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Date of Birth</p>
            {editing ? (
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-[#13131a] border border-purple-600/50 rounded-lg px-3 py-1.5 text-gray-300 text-sm outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
              />
            ) : (
              <p className="text-gray-300 text-sm font-medium">
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : <span className="text-gray-600 italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="bg-[#1a1a24] border border-white/[0.05] rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Username</p>
            <p className="text-gray-300 text-sm font-medium">@{user.username}</p>
            <p className="text-[11px] text-gray-600 italic mt-1">Unique · cannot be changed</p>
          </div>

          {/* Email — full width */}
          <div className="sm:col-span-2 bg-[#1a1a24] border border-white/[0.05] rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Email</p>
            <p className="text-gray-300 text-sm font-medium break-all">{user.email}</p>
            <p className="text-[11px] text-gray-600 italic mt-1">Account email · contact support to change</p>
          </div>

        </div>
      </div>
    </div>
  );
};

const CameraIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export default Profile;