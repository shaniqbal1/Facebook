import React from "react";
import Navbar from "../component/navebar.jsx";
import Sidebar from "../component/sideBar.jsx";

const NexusLayout = ({ children }) => {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: #0a0814;
          color: #e5e7eb;
        }
      `}</style>

      {/* ✅ No props needed (using context inside components) */}
      <Navbar />
      <Sidebar />

      {/* Layout */}
      <main
        className="
        mt-16
        ml-0 md:ml-60
        pb-16 md:pb-0
        min-h-screen
        px-4 sm:px-6 md:px-8
        py-4 md:py-6
        box-border
      "
      >
        {children}
      </main>
    </>
  );
};

export default NexusLayout;