import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [open, setOpen] = useState(false); // sidebar toggle

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
      <header className="flex items-center justify-between bg-white px-4 md:px-6 py-4 shadow">
        <div className="flex items-center gap-3">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 text-2xl"
          >
            ☰
          </button>

          <div>
            <h1 className="text-xl font-bold text-orange-600">
              Sri Sai Groups
            </h1>
            <p className="text-sm text-gray-500 hidden sm:block">
              Employer & Employee Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">
              {admin?.name || "Admin"}
            </p>
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
      <div className="flex relative">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static z-40 top-0 left-0
            h-full w-64 bg-white border-r p-4
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <nav className="space-y-2 mt-12 md:mt-0">
            <Link onClick={() => setOpen(false)} className="block p-2 rounded bg-orange-50 text-orange-600" to="/admin/dashboard">Dashboard</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/profile">Profile</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/notifications">Notifications</Link>
            {/* <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/tasks">Tasks</Link> */}
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/forms">Forms</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/employees">Add Employee</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/invoices">Invoices</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/payments">Payments</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/Payslip">Payslip</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/reports">Reports</Link>
            <Link onClick={() => setOpen(false)} className="block p-2 rounded hover:bg-gray-100" to="/admin/epfo-requests">EPFO Requests</Link>
          </nav>
        </aside>

        {/* OVERLAY (mobile) */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 md:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
