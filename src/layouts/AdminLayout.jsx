import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (!admin) navigate("/admin/login");
  }, [admin, navigate]);

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div>
          <h1 className="text-xl font-bold text-orange-600">Sri Sai Groups</h1>
          <p className="text-sm text-gray-500">Employer & Employee Portal</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{admin?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">Employer</p>
          </div>
          <button
            onClick={logout}
            className="border border-orange-500 text-orange-600 px-3 py-1 rounded hover:bg-orange-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white min-h-screen border-r p-4">
          <nav className="space-y-2">
            <Link className="block p-2 rounded bg-orange-50 text-orange-600" to="/admin/dashboard">Dashboard</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/profile">Profile</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/notifications">Notifications</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/tasks">Tasks</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/employees">Add Employee</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/invoices">Invoices</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/payments">Payments</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/reports">Reports</Link>
            <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/epfo-requests">EPFO Requests</Link>
          </nav>
        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
