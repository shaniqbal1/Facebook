import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth page (login + register) */}
        <Route path="/" element={<AuthPage />} />

        {/* Example dashboard route (after login) */}
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
         <Route path="/Register" element={<Register />} />
       <Route path="/login" element={<AuthPage />} />  {/* ✅ MUST EXIST */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;