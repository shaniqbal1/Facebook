import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext.jsx"; // ✅ ADD THIS

import AuthPage from "./pages/authPage.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Profile from "./pages/userProfile.jsx";
import CreatePost from "./component/createpost.jsx";
import NexusLayout from "./component/nexusLayout.jsx";

const ProtectedLayout = ({ children }) => {
  return <NexusLayout>{children}</NexusLayout>;
};

function App() {
  return (
    <UserProvider> {/* ✅ WRAP EVERYTHING */}
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
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;