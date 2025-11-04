// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import FooterDashboard from "../components/FooterDashboard";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex min-h-[calc(100vh-56px)] bg-gray-100 transition-all">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-200/70 backdrop-blur-[1px] z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>

      <FooterDashboard />
    </>
  );
}
