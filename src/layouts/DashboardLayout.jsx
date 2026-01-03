import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function DashboardLayout({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOPBAR */}
      <Topbar
        user={user}
        onLogout={onLogout}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        {/* SIDEBAR */}
        <Sidebar
          role={user.role}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* CONTENT */}
        <main className="flex-1 p-4 lg:p-6">
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}
