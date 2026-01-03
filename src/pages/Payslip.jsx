import React from "react";
import { useState } from "react";
import { employees } from "../data/mock.js";

export default function Payslip({ user }) {
  const [empId, setEmpId] = useState(employees[0].id);
  const [month, setMonth] = useState("2025-12");

  const generate = (e) => {
    e.preventDefault();
    alert(`Payslip generated for ${empId} - ${month}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Payslip generator</h3>
        <form className="space-y-3" onSubmit={generate}>
          <div>
            <label className="label">Employee</label>
            <select className="input" value={empId} onChange={e => setEmpId(e.target.value)}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Month</label>
            <input className="input" type="month" value={month} onChange={e => setMonth(e.target.value)} />
          </div>
          <button className="btn-primary">Generate</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Preview</h3>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Company Pvt Ltd</p>
              <p className="text-xs text-gray-600">Coimbatore, Tamil Nadu</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Payslip</p>
              <p className="text-xs text-gray-600">{month}</p>
            </div>
          </div>
          <hr className="my-3" />
          <p className="text-sm"><span className="font-medium">Employee:</span> {employees.find(e => e.id === empId)?.name}</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="card p-3">
              <p className="text-sm">Basic: ₹30,000</p>
              <p className="text-sm">HRA: ₹10,000</p>
              <p className="text-sm">Allowance: ₹5,000</p>
            </div>
            <div className="card p-3">
              <p className="text-sm">PF: ₹3,600</p>
              <p className="text-sm">ESI: ₹0</p>
              <p className="text-sm">TDS: ₹1,500</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button className="btn-secondary">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
