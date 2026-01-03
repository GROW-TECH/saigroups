import React from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import { tasks, invoices } from "../data/mock.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const avgProgress = Math.round(
    tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / (tasks.length || 1)
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card p-6">
        <h3 className="font-semibold mb-2">Overall progress</h3>
        <ProgressBar value={avgProgress} />
        <p className="text-sm text-gray-600 mt-2">{avgProgress}% tasks completed</p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-2">Invoices</h3>
        <p className="text-sm text-gray-600">Paid: {invoices.filter(i => i.status === "paid").length}</p>
        <p className="text-sm text-gray-600">Pending: {invoices.filter(i => i.status !== "paid").length}</p>
        <Link to="/invoices" className="btn-secondary mt-3">View invoices</Link>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-2">Quick actions</h3>
        <div className="flex gap-2">
          <Link to="/tasks" className="btn-primary">Assign task</Link>
          <Link to="/payments" className="btn-secondary">Take payment</Link>
        </div>
      </div>
    </div>
  );
}
