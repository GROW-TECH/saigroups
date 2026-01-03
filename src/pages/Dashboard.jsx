import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import { Link } from "react-router-dom";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(false);

  const [data, setData] = useState({
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalEarnings: 0,
    totalPayslips: 0,
    invoices: { paid: 0, pending: 0 },
  });

  /* ================= DETECT ROLE ================= */
  useEffect(() => {
    if (!user) return;

    // role OR user_type (support both)
    const role = user.role || user.user_type;
    setIsEmployee(role === "employee");
  }, [user]);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    if (!user) return;

    // ================= EMPLOYEE =================
    if (isEmployee) {
      const dashboardUrl = `${API}/Dashboard/employee.php?employee_id=${user.employee_id || user.id}`;
      const tasksUrl = `${API}/tasks/list.php?user_id=${user.id}&role=${user.role || user.user_type}&ts=${Date.now()}`;

      Promise.all([
        fetch(dashboardUrl).then((res) => res.json()),
        fetch(tasksUrl, { cache: "no-store" }).then((res) => res.json()),
      ])
        .then(([dashboardRes, tasksRes]) => {
          const tasks = Array.isArray(tasksRes) ? tasksRes : [];

          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(
            (t) => t.status === "completed"
          ).length;

          const progress =
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0;

          setData({
            progress,
            totalTasks,
            completedTasks,
            totalEarnings: dashboardRes?.data?.totalEarnings || 0,
            totalPayslips: dashboardRes?.data?.totalPayslips || 0,
            invoices: { paid: 0, pending: 0 }, // unused for employee
          });
        })
        .finally(() => setLoading(false));
    }

    // ================= EMPLOYER =================
    else {
      fetch(`${API}/Dashboard/employer.php?employer_id=${user.id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setData(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, isEmployee]);

  /* ================= HELPERS ================= */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* OVERALL PROGRESS (BOTH) */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-3">Overall Progress</h3>
        <ProgressBar value={data.progress} />
        <p className="text-sm text-gray-600 mt-2">
          {data.completedTasks} / {data.totalTasks} tasks completed
        </p>
      </div>

      {/* ================= EMPLOYEE ================= */}
      {isEmployee && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Total Earnings</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(data.totalEarnings)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            From {data.totalPayslips} payslip
            {data.totalPayslips !== 1 ? "s" : ""}
          </p>

          <Link
            to="/payslip"
            className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
          >
            View Payslips
          </Link>
        </div>
      )}

      {/* ================= EMPLOYER ================= */}
      {!isEmployee && (
        <>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Invoices</h3>
            <p className="text-sm text-gray-700">
              Paid: <span className="font-medium">{data.invoices.paid}</span>
            </p>
            <p className="text-sm text-gray-700">
              Pending:{" "}
              <span className="font-medium">{data.invoices.pending}</span>
            </p>

            <Link
              to="/invoices"
              className="inline-block mt-4 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              View Invoices
            </Link>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="flex gap-3">
              <Link
                to="/tasks"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Assign Task
              </Link>

              <Link
                to="/payments"
                className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Take Payment
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
