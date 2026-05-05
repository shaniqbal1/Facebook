import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/userContext.jsx";

import AuthPage from "./pages/authPage.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./component/dashboard.jsx";
import Profile from "./pages/userProfile.jsx";
import CreatePost from "./component/createpost.jsx";
import NexusLayout from "./component/nexusLayout.jsx";
import Notifications from "./component/dashboard/notification.jsx"; // ✅ ADD THIS

// Optional: protect routes if user not logged in
const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <NexusLayout>{children}</NexusLayout>;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={<ProtectedLayout><Dashboard /></ProtectedLayout>}
          />

          <Route
            path="/profile"
            element={<ProtectedLayout><Profile /></ProtectedLayout>}
          />

          <Route
            path="/create"
            element={<ProtectedLayout><CreatePost /></ProtectedLayout>}
          />

          {/* ✅ FIXED: notifications route */}
          <Route
            path="/notifications"
            element={<ProtectedLayout><Notifications /></ProtectedLayout>}
          />

          {/* ✅ Optional fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;