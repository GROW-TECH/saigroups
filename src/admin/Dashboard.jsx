import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API =
  "https://projects.growtechnologies.in/srisaigroups/api/admin/dashboard.php";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4 md:p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* MAIN CARD */}
      <div className="bg-white border border-orange-300 rounded-2xl shadow-sm p-4 md:p-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-orange-600 font-semibold text-lg">
            Dashboard Overview
          </h2>

          <button className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-600 w-full sm:w-auto">
            Admin Panel
          </button>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {/* TASKS */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-1">Tasks</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {data.tasks}
            </p>
            <p className="text-sm text-gray-500">Total tasks</p>
          </div>

          {/* INVOICES */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">Invoices</h3>
            <p className="text-sm">Paid: {data.invoices.paid}</p>
            <p className="text-sm">Pending: {data.invoices.pending}</p>

            <Link
              to="/admin/invoices"
              className="inline-block mt-3 px-4 py-2 border border-orange-300 rounded text-sm hover:bg-orange-50 w-full sm:w-auto text-center"
            >
              View invoices
            </Link>
          </div>

          {/* EMPLOYEES */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">Employees</h3>
            <p className="text-3xl font-bold text-blue-600">
              {data.employees}
            </p>
          </div>

          {/* EMPLOYERS */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">Employers</h3>
            <p className="text-3xl font-bold text-purple-600">
              {data.employers}
            </p>
          </div>

          {/* PAYMENTS */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">Payments</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹ {data.payments.total_amount}
            </p>
          </div>

          {/* EMPLOYEE PAYSLIPS */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">Employee Payslips</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {data.payslips.employees}
            </p>
          </div>

          {/* EMPLOYER PAYSLIPS */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">Employer Payslips</h3>
            <p className="text-3xl font-bold text-purple-600">
              {data.payslips.employers}
            </p>
          </div>

          {/* EPFO REQUESTS */}
          <div className="bg-white border border-orange-200 rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-2">EPFO Requests</h3>
            <p className="text-3xl font-bold text-orange-600">
              {data.epfo_requests}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
