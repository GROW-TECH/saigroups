import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import logo from "/logo.jpg";

export default function Topbar({ user, onLogout, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-orange-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between">
        
        {/* LEFT: HAMBURGER + LOGO */}
        <div className="flex items-center gap-3">
          {/* ☰ MOBILE MENU */}
          {user && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-orange-50 text-orange-600"
            >
              ☰
            </button>
          )}

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Sri Sai Groups"
              className="h-10 w-10 lg:h-14 lg:w-14 rounded-md object-cover"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg lg:text-2xl font-bold text-orange-600">
                Sri Sai Groups
              </span>
              <span className="text-xs text-gray-500">
                Employer & Employee Portal
              </span>
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* NOTIFICATIONS */}
          <Link to="/notifications" className="relative">
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-orange-600" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1.5">
              3
            </span>
          </Link>

          {/* USER INFO */}
          {user && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user.role}
              </span>
            </div>
          )}

          {/* AUTH BUTTON */}
          {user ? (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-sm rounded-md border border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
