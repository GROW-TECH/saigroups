import React, { useEffect, useState } from "react";
import Table from "../components/Table.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  /* LOAD EMPLOYEES */
  useEffect(() => {
    fetch(`${API}/reports/employees.php`)
      .then(r => r.json())
      .then(res => res.success && setEmployees(res.data || []))
      .catch(console.error);
  }, []);

  /* LOAD REPORT */
  const loadReport = id => {
    setEmployeeId(id);
    setReport(null);
    if (!id) return;

    setLoading(true);
    fetch(`${API}/reports/employee_full.php?employee_id=${id}`)
      .then(r => r.json())
      .then(res => res.success && setReport(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Employee Reports</h2>

        <select
          className="border rounded px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-orange-400"
          value={employeeId}
          onChange={e => loadReport(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>
              {e.employee_code} - {e.employee_name}
            </option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500 text-sm">Loading report...</div>
      )}

      {/* REPORT */}
      {report && (
        <>
          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Tasks" value={report.tasks?.total ?? 0} />
            <StatCard
              title="Completed Tasks"
              value={report.tasks?.completed ?? 0}
            />
            <StatCard
              title="Remaining Tasks"
              value={report.tasks?.remaining ?? 0}
            />
            <StatCard
              title="Total Salary Earned"
              value={`₹ ${report.salary ?? 0}`}
              highlight
            />
          </div>

          {/* EPFO */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-3">EPFO Requests</h3>

            {report.epfo?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {report.epfo.map(e => (
                  <span
                    key={e.status}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 border"
                  >
                    {e.status} : <b>{e.count}</b>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No EPFO requests found
              </div>
            )}
          </div>

          {/* PAYSLIPS */}
          <div className="bg-white border rounded-lg p-4 overflow-x-auto">
            <h3 className="font-medium mb-3">Salary Payslips</h3>

            <Table
              columns={[
                { key: "month_year", title: "Month" },
                { key: "basic_salary", title: "Basic" },
                { key: "allowances", title: "Allowances" },
                { key: "deductions", title: "Deductions" },
                { key: "net_salary", title: "Net Salary" },
                { key: "generated_at", title: "Generated On" }
              ]}
              data={report.payslips || []}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* SMALL STAT CARD */
function StatCard({ title, value, highlight = false }) {
  return (
    <div
      className={`border rounded-lg p-4 bg-white ${
        highlight ? "border-orange-300" : ""
      }`}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div
        className={`text-xl font-semibold mt-1 ${
          highlight ? "text-orange-600" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
