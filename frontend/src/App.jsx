import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth page (login + register) */}
        <Route path="/" element={<AuthPage />} />

        {/* Example dashboard route (after login) */}
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;