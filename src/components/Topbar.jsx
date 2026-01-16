import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import logo from "/logo.jpg";

export default function Topbar({ user, onLogout, onMenuClick }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetch(
      "https://projects.growtechnolgies.in/srisaigroups/api/notifications_count.php",
      {
        method: "GET",
        credentials: "include", // REQUIRED for session
      }
    )
      .then(res => res.json())
      .then(data => setCount(data.count || 0))
      .catch(() => setCount(0));
  }, [user]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-orange-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-orange-50 text-orange-600"
            >
              ☰
            </button>
          )}

          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Sri Sai Groups"
              className="h-10 w-10 lg:h-14 lg:w-14 rounded-md"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg lg:text-2xl font-bold text-orange-600">
                Sri Sai Groups
              </span>
              <span className="text-xs text-gray-500">
                Employer & Employee Portal
              </span>
            </div>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* 🔔 Notifications */}
         

          {/* USER */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-sm rounded-md border border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
