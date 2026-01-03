import React from "react";

export default function EmployeeDashboard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Overall Progress */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-3">Overall Progress</h3>
        <p className="text-sm text-gray-500">Employee task progress</p>
      </div>

      {/* Total Earnings */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-3">Total Earnings</h3>
        <p className="text-2xl font-bold text-green-600">₹ 0</p>
        <p className="text-sm text-gray-500">From all payslips</p>
      </div>
    </div>
  );
}
