import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const UserContext = createContext();

const API = "http://localhost:8000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUnreadCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(`${API}/api/notifications/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUnreadCount(0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      fetchUser,
      unreadCount,
      setUnreadCount,
      fetchUnreadCount,
      markNotificationsRead,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);