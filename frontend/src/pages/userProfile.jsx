import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 if not logged in → redirect
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  // 👤 GET PROFILE
  const getProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  if (!user) return <h2>No user found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Profile</h1>

      {/* PROFILE IMAGE */}
      <img
        src={
          user.profileImage
            ? `http://localhost:8000/${user.profileImage}`
            : "https://via.placeholder.com/100"
        }
        alt="profile"
        width="120"
        height="120"
        style={{ borderRadius: "50%" }}
      />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        style={{ marginTop: "10px" }}
      >
        Logout
      </button>
    </div>
  );
}