import React, { useEffect, useState } from "react";
import Table from "../components/Table.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Reports() {
  const [userType, setUserType] = useState("employee"); // 'employee' or 'employer'
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  /* LOAD EMPLOYEES */
  useEffect(() => {
    fetch(`${API}/reports/employees.php`)
      .then(r => r.json())
      .then(res => res.success && setEmployees(res.data || []))
      .catch(console.error);
  }, []);

  /* LOAD EMPLOYERS */
  useEffect(() => {
    fetch(`${API}/reports/employers.php`)
      .then(r => r.json())
      .then(res => res.success && setEmployers(res.data || []))
      .catch(console.error);
  }, []);

  /* LOAD REPORT */
  const loadReport = (id, type) => {
    setSelectedId(id);
    setReport(null);
    if (!id) return;

    setLoading(true);
    const endpoint = type === "employee" 
      ? `${API}/reports/employee_full.php?employee_id=${id}`
      : `${API}/reports/employer_full.php?employer_id=${id}`;

    fetch(endpoint)
      .then(r => r.json())
      .then(res => res.success && setReport(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  /* HANDLE USER TYPE CHANGE */
  const handleUserTypeChange = (type) => {
    setUserType(type);
    setSelectedId("");
    setReport(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Reports</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* USER TYPE TOGGLE */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => handleUserTypeChange("employee")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                userType === "employee"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Employee
            </button>
            <button
              onClick={() => handleUserTypeChange("employer")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                userType === "employer"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Employer
            </button>
          </div>

          {/* DROPDOWN */}
          <select
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedId}
            onChange={e => loadReport(e.target.value, userType)}
          >
            <option value="">
              Select {userType === "employee" ? "Employee" : "Employer"}
            </option>
            {userType === "employee"
              ? employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.employee_code} - {e.employee_name}
                  </option>
                ))
              : employers.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.organization_code} - {e.organization_name}
                  </option>
                ))}
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-orange-600"></div>
          <span className="ml-3 text-gray-500">Loading report...</span>
        </div>
      )}

      {/* REPORT */}
      {report && (
        <>
          {/* SUMMARY - EMPLOYEE */}
          {userType === "employee" && (
            <>
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

              {/* EPFO - EMPLOYEE ONLY */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  EPFO Requests
                </h3>

                {report.epfo?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.epfo.map(e => (
                      <span
                        key={e.status}
                        className="px-4 py-2 rounded-full text-sm bg-orange-50 border border-orange-200 text-orange-700 font-medium"
                      >
                        {e.status} : <b>{e.count}</b>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm py-2">
                    No EPFO requests found
                  </div>
                )}
              </div>
            </>
          )}

          {/* SUMMARY - EMPLOYER */}
          {userType === "employer" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="Total Payslips"
                value={report.payslip_count ?? 0}
              />
              <StatCard
                title="Total Salary Earned"
                value={`₹ ${report.salary ?? 0}`}
                highlight
              />
            </div>
          )}

          {/* PAYSLIPS - BOTH */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-x-auto shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Salary Payslips
            </h3>

            {report.payslips?.length > 0 ? (
              <Table
                columns={[
                  { key: "month_year", title: "Month" },
                  { key: "basic_salary", title: "Basic Salary" },
                  { key: "allowances", title: "Allowances" },
                  { key: "deductions", title: "Deductions" },
                  { key: "net_salary", title: "Net Salary" },
                  { key: "generated_at", title: "Generated On" }
                ]}
                data={report.payslips || []}
              />
            ) : (
              <div className="text-gray-500 text-sm py-2">
                No payslips found
              </div>
            )}
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!loading && !report && selectedId === "" && (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Report Selected</h3>
          <p className="text-gray-500 mt-2">
            Select an {userType === "employee" ? "employee" : "employer"} to view their report
          </p>
        </div>
      )}
    </div>
  );
}

/* SMALL STAT CARD */
function StatCard({ title, value, highlight = false }) {
  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm transition-all hover:shadow-md ${
        highlight ? "border-orange-300 bg-orange-50" : "border-gray-200"
      }`}
    >
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div
        className={`text-2xl font-bold ${
          highlight ? "text-orange-600" : "text-gray-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
}