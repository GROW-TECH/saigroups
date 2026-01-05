import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

/* ================= USER PAGES ================= */
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import Tasks from "./pages/Tasks.jsx";
import Forms from "./pages/Forms.jsx";
import Invoices from "./pages/Invoices.jsx";
import IdCreation from "./pages/IdCreation.jsx";
import EpfoRequests from "./pages/EpfoRequests.jsx";
import Reports from "./pages/Reports.jsx";
import Payments from "./pages/Payments.jsx";
import Payslip from "./pages/Payslip.jsx";
import Addpayslip from "./pages/AddPayslip.jsx";
import Files from "./pages/Files.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
/* ================= ADMIN PAGES ================= */
import AdminLogin from "./admin/login.jsx";
import AdminDashboard from "./admin/Dashboard.jsx";
import AdminProfile from "./admin/profile.jsx";
import AdminTasks from "./admin/Tasks.jsx";
import AdminForms from "./admin/Forms.jsx";
import AdminReports from "./admin/Reports.jsx";
import AdminInvoices from "./admin/Invoices.jsx";
import AdminNotifications from "./admin/Notifications.jsx";
import AdminPayments from "./admin/payment.jsx";
import AdminEpfoRequest from "./admin/EpfoRequests.jsx";
import AdminEmployee from "./admin/employee.jsx"; // ✅ REQUIRED
import AdminPayslip from "./admin/Payslip.jsx";
import AdminFileAttachment from "./admin/FileAttachment.jsx";

export default function App() {
  const navigate = useNavigate();

  /* ============ USER AUTH ============ */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  /* ============ ADMIN AUTH ============ */
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("admin");
    return saved ? JSON.parse(saved) : null;
  });

  /* USER LOGIN REDIRECT */
 useEffect(() => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/companyprofile", { replace: true });
  } else {
    localStorage.removeItem("user");
  }
}, [user]);


  /* ADMIN LOGIN REDIRECT */
  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
      navigate("/admin/dashboard");
    } else {
      localStorage.removeItem("admin");
    }
  }, [admin]);

  const requireAuth = (element) =>
    user ? element : <Navigate to="/login" replace />;

  const requireAdmin = (element) =>
    admin ? element : <Navigate to="/admin/login" replace />;

  return (
    <Routes>

      {/* ================= USER AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login onLogin={setUser} />} />
      </Route>

      {/* ================= USER DASHBOARD ================= */}
      <Route
        element={
          <DashboardLayout
            user={user}
            onLogout={() => setUser(null)}
          />
        }
      >
        <Route path="/" element={requireAuth(<Dashboard />)} />
        <Route path="/companyprofile" element={requireAuth(<CompanyProfile />)} />
        <Route path="/profile" element={requireAuth(<Profile />)} />
        <Route path="/notifications" element={requireAuth(<Notifications />)} />
        <Route path="/tasks" element={requireAuth(<Tasks user={user} />)} />
        <Route path="/forms" element={requireAuth(<Forms />)} />
        <Route path="/invoices" element={requireAuth(<Invoices />)} />
        <Route path="/files" element={requireAuth(<Files />)} />
        <Route path="/id-creation" element={requireAuth(<IdCreation />)} />
        <Route path="/epfo-requests" element={requireAuth(<EpfoRequests />)} />
        
        <Route path="/reports" element={requireAuth(<Reports />)} />
        <Route path="/payments" element={requireAuth(<Payments />)} />
        <Route path="/addpayslip" element={requireAuth(<Addpayslip />)} />
        <Route path="/payslip" element={requireAuth(<Payslip user={user} />)} />
      </Route>

     {/* ================= ADMIN ================= */}
<Route path="/admin/login" element={<AdminLogin onLogin={setAdmin} />} />

  {/* ================= ADMIN DASHBOARD ================= */}
      <Route
        path="/admin"
        element={requireAdmin(
          <AdminLayout onLogout={() => setAdmin(null)} />
        )}
      >
        <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="profile" element={<AdminProfile />} />
  <Route path="tasks" element={<AdminTasks />} />
  <Route path="forms" element={<AdminForms />} />
  <Route path="fileattachment" element={<AdminFileAttachment />} />
  <Route path="reports" element={<AdminReports />} />
  <Route path="invoices" element={<AdminInvoices />} />
  <Route path="notifications" element={<AdminNotifications />} />
  <Route path="payments" element={<AdminPayments />} />
  <Route path="epfo-requests" element={<AdminEpfoRequest />} /> {/* ✅ FIX */}
  <Route path="employees" element={<AdminEmployee />} />
   <Route path="payslip" element={<AdminPayslip />} />
      </Route>


    </Routes>
  );
}