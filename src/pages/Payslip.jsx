import React, { useState } from "react";

export default function Payslip({ user }) {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const fetchPayslip = async (e) => {
    e.preventDefault();
    if (!month) return;

    setLoading(true);
    setError("");
    setData(null);
    setSearched(true);

    try {
      const cleanMonth = month.slice(0, 7);

      const res = await fetch(
        `https://projects.growtechnologies.in/srisaigroups/api/payslips/get_my_payslip.php?user_id=${user.id}&month=${cleanMonth}&_=${Date.now()}`,
        { cache: "no-store" }
      );

      const result = await res.json();

      if (res.status === 404) {
        setData(null);
        return;
      }

      if (!res.ok) {
        setError(result.message || "Unable to fetch payslip");
        return;
      }

      setData(result);
    } catch {
      setError("Unable to fetch payslip");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v || 0);

  const handlePrint = () => window.print();

  return (
    <>
      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute;
            inset: 0;
            padding: 30px;
            font-size: 14px;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-xl font-semibold mb-4">My Payslip</h3>

          <form onSubmit={fetchPayslip} className="space-y-4">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
            >
              {loading ? "Loading..." : "View Payslip"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-xl font-semibold mb-4">Preview</h3>

          {!loading && searched && !data && !error && (
            <p className="text-gray-500">No payslip found</p>
          )}

          {error && <p className="text-red-600">{error}</p>}

          {data && (
            <div className="print-area border rounded-lg p-6">
              {/* HEADER */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-orange-600">
                  Sri Sai Groups
                </h1>
                <p className="text-gray-600">Salary Payslip</p>
                <p className="font-semibold mt-1">
                  Payslip for {data.month_year}
                </p>
              </div>

              {/* INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
                <p><b>Employee Code:</b> {data.employee_code}</p>
                <p><b>Employee Name:</b> {data.employee_name}</p>
                <p><b>Department:</b> {data.department}</p>
                <p><b>Designation:</b> {data.designation}</p>
              </div>

              {/* TABLE — EXACT LIKE IMAGE */}
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="text-left px-4 py-2 border">Description</th>
                    <th className="text-right px-4 py-2 border">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border">Basic Salary</td>
                    <td className="px-4 py-2 border text-right">
                      {formatCurrency(data.basic_salary)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Allowances</td>
                    <td className="px-4 py-2 border text-right">
                      {formatCurrency(data.allowances)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Deductions</td>
                    <td className="px-4 py-2 border text-right text-red-600">
                      -{formatCurrency(data.deductions)}
                    </td>
                  </tr>
                  <tr className="bg-yellow-100 font-bold">
                    <td className="px-4 py-2 border">Net Salary</td>
                    <td className="px-4 py-2 border text-right">
                      {formatCurrency(data.net_salary)}
                    </td>
                  </tr>
                </tbody>
              </table>

             

              <div className="text-center mt-6 no-print">
                <button
                  onClick={handlePrint}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
