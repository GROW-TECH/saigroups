import React from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { tasks, invoices } from "../data/mock";

export default function AdminDashboard() {
  const avgProgress = Math.round(
    tasks.reduce((a, t) => a + (t.progress || 0), 0) / (tasks.length || 1)
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-2">Overall progress</h3>
        <ProgressBar value={avgProgress} />
        <p className="text-sm text-gray-600 mt-2">
          {avgProgress}% tasks completed
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-2">Invoices</h3>
        <p className="text-sm">Paid: {invoices.filter(i => i.status === "paid").length}</p>
        <p className="text-sm">Pending: {invoices.filter(i => i.status !== "paid").length}</p>

        <Link to="/admin/invoices" className="inline-block mt-3 px-4 py-2 border rounded">
          View invoices
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-2">Quick actions</h3>
        <div className="flex gap-2">
          <Link to="/admin/tasks" className="px-4 py-2 bg-indigo-600 text-white rounded">
            Assign task
          </Link>
          <Link to="/admin/payments" className="px-4 py-2 border rounded">
            Take payment
          </Link>
        </div>
      </div>
    </div>
  );
}
