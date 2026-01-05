import React, { useEffect, useState } from "react";

const API_BASE = "https://projects.growtechnologies.in/srisaigroups/api";

export default function AddPayslip() {
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employee_id: "",
    month_year: "",
    basic_salary: "",
    allowances: "",
    deductions: "",
    net_salary: 0,
  });

  /* LOAD DATA ON MOUNT */
  useEffect(() => {
    loadEmployees();
    loadPayslips();
  }, []);

  const loadEmployees = () => {
    // Now fetching directly from users table
    fetch(`${API_BASE}/payslips/employee.php`)
      .then(r => r.json())
      .then(res => {
        const list = res.data ?? res ?? [];
        setEmployees(list);
      })
      .catch(err => {
        console.error('Error loading employees:', err);
        setEmployees([]);
      });
  };

  const loadPayslips = () => {
    fetch(`${API_BASE}/payslips/list.php`)
      .then(r => r.json())
      .then(res => {
        const list = res.data ?? res ?? [];
        setPayslips(list);
      })
      .catch(err => {
        console.error('Error loading payslips:', err);
        setPayslips([]);
      });
  };

  /* AUTO CALC NET */
  useEffect(() => {
    const basic = Number(form.basic_salary || 0);
    const allow = Number(form.allowances || 0);
    const deduct = Number(form.deductions || 0);
    setForm(f => ({ ...f, net_salary: basic + allow - deduct }));
  }, [form.basic_salary, form.allowances, form.deductions]);

  const submit = async () => {
    if (!form.employee_id || !form.month_year) {
      alert("Employee & Month required");
      return;
    }

    setLoading(true);

    const url = editingId 
      ? `${API_BASE}/payslips/update.php`
      : `${API_BASE}/payslips/create.php`;

    const payload = editingId 
      ? { ...form, id: editingId }
      : form;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert(editingId ? "Payslip updated successfully" : "Payslip created successfully");
      setForm({
        employee_id: "",
        month_year: "",
        basic_salary: "",
        allowances: "",
        deductions: "",
        net_salary: 0,
      });
      setEditingId(null);
      loadPayslips();
    } else {
      alert(data.message || "Failed");
    }
  };

  const handleEdit = (payslip) => {
    setForm({
      employee_id: payslip.employee_id,
      month_year: payslip.month_year,
      basic_salary: payslip.basic_salary,
      allowances: payslip.allowances,
      deductions: payslip.deductions,
      net_salary: payslip.net_salary,
    });
    setEditingId(payslip.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this payslip?")) {
      return;
    }

    const res = await fetch(`${API_BASE}/payslips/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Payslip deleted successfully");
      loadPayslips();
    } else {
      alert(data.message || "Failed to delete");
    }
  };

  const handleCancelEdit = () => {
    setForm({
      employee_id: "",
      month_year: "",
      basic_salary: "",
      allowances: "",
      deductions: "",
      net_salary: 0,
    });
    setEditingId(null);
  };

  const handlePrint = (payslip) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${payslip.employee_name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #ea580c;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 10px;
            background: #f9f9f9;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .salary-table th,
          .salary-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .salary-table th {
            background: #ea580c;
            color: white;
          }
          .salary-table .total-row {
            background: #fef3c7;
            font-weight: bold;
            font-size: 1.1em;
          }
          .text-right {
            text-align: right;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
          }
          @media print {
            body {
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sri Sai Groups</h1>
          <p>Employer & Employee Portal</p>
          <p>Payslip for ${payslip.month_year}</p>
        </div>

        <div class="info-row">
          <div><span class="info-label">Employee ID:</span> ${payslip.employee_id}</div>
          <div><span class="info-label">Employee Name:</span> ${payslip.employee_name}</div>
        </div>

        <div class="info-row">
          <div><span class="info-label">Month/Year:</span> ${payslip.month_year}</div>
          <div><span class="info-label">Generated:</span> ${new Date(payslip.generated_at).toLocaleDateString('en-IN')}</div>
        </div>

        <table class="salary-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td class="text-right">${Number(payslip.basic_salary).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Allowances</td>
              <td class="text-right">${Number(payslip.allowances).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Deductions</td>
              <td class="text-right">-${Number(payslip.deductions).toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td>Net Salary</td>
              <td class="text-right">₹ ${Number(payslip.net_salary).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

      
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="background: #ea580c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print Payslip
          </button>
          <button onclick="window.close()" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Payslip Management</h1>
          <p className="text-gray-600 mt-1">Create and manage employee payslips</p>
        </div>

        {/* ADD PAYSLIP FORM */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingId ? "Edit Payslip" : "Create New Payslip"}
            </h3>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EMPLOYEE - Updated to show user info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.employee_id}
                onChange={e => setForm({ ...form, employee_id: e.target.value })}
              >
                <option value="">Choose an employee</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name} {e.email ? `(${e.email})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* MONTH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month/Year
              </label>
              <input
                type="month"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.month_year}
                onChange={e => setForm({ ...form, month_year: e.target.value })}
              />
            </div>

            {/* BASIC SALARY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Salary
              </label>
              <input
                type="number"
                placeholder="Enter basic salary"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.basic_salary}
                onChange={e => setForm({ ...form, basic_salary: e.target.value })}
              />
            </div>

            {/* ALLOWANCES */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowances
              </label>
              <input
                type="number"
                placeholder="Enter allowances"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.allowances}
                onChange={e => setForm({ ...form, allowances: e.target.value })}
              />
            </div>

            {/* DEDUCTIONS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deductions
              </label>
              <input
                type="number"
                placeholder="Enter deductions"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.deductions}
                onChange={e => setForm({ ...form, deductions: e.target.value })}
              />
            </div>

            {/* NET SALARY DISPLAY */}
            <div className="flex items-end">
              <div className="w-full bg-orange-50 border-2 border-orange-200 rounded-lg px-4 py-3">
                <div className="text-sm text-gray-600 mb-1">Net Salary</div>
                <div className="text-2xl font-bold text-orange-600">
                  ₹ {form.net_salary.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Payslip" : "Create Payslip")}
          </button>
        </div>

        {/* PAYSLIPS TABLE - Updated column headers */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Payslip Records</h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Total: {payslips.length}
            </span>
          </div>

          {payslips.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-500">No payslips found</p>
              <p className="text-sm text-gray-400">Create your first payslip above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Month/Year
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Allowances
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payslips.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {p.employee_id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.employee_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.month_year}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        ₹ {Number(p.basic_salary).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                        + ₹ {Number(p.allowances).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                        - ₹ {Number(p.deductions).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-orange-600 text-right">
                        ₹ {Number(p.net_salary).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(p.generated_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePrint(p)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            title="Print"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-green-600 hover:text-green-800 font-medium"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}