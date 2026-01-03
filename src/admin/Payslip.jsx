import React, { useEffect, useState } from "react";

const API =
  "https://projects.growtechnologies.in/srisaigroups/api/admin/payslips";

export default function PayslipManagement() {
  const [payslips, setPayslips] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewType, setViewType] = useState("employee"); // employee | employer
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    employer_id: "",
    month_year: "",
    basic_salary: "",
    allowances: "",
    deductions: "",
    net_salary: "",
  });

  /* ================= LOAD PAYSLIPS ================= */
  const loadPayslips = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/list.php?mode=${viewType}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setPayslips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setPayslips([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD EMPLOYERS ================= */
  const loadEmployers = async () => {
    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/admin/employees/list.php?type=employer"
      );
      const data = await res.json();
      setEmployers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPayslips();
    if (viewType === "employer") loadEmployers();
  }, [viewType]);

  /* ================= NET SALARY ================= */
  useEffect(() => {
    const net =
      (parseFloat(form.basic_salary) || 0) +
      (parseFloat(form.allowances) || 0) -
      (parseFloat(form.deductions) || 0);

    setForm((p) => ({ ...p, net_salary: net.toFixed(2) }));
  }, [form.basic_salary, form.allowances, form.deductions]);

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `${API}/update.php`
      : `${API}/create.php`;

    const payload = editId ? { ...form, id: editId } : form;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    alert(editId ? "Payslip updated!" : "Payslip created!");
    setShowForm(false);
    setEditId(null);
    resetForm();
    loadPayslips();
  };

  /* ================= EDIT ================= */
  const editPayslip = (p) => {
    setEditId(p.id);
    setForm({
      employer_id: p.employer_id,
      month_year: p.month_year,
      basic_salary: p.basic_salary,
      allowances: p.allowances,
      deductions: p.deductions,
      net_salary: p.net_salary,
    });
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const deletePayslip = async (id) => {
    if (!window.confirm("Delete this payslip?")) return;

    const res = await fetch(`${API}/delete.php?id=${id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    alert("Payslip deleted");
    loadPayslips();
  };

  const resetForm = () => {
    setForm({
      employer_id: "",
      month_year: "",
      basic_salary: "",
      allowances: "",
      deductions: "",
      net_salary: "",
    });
  };

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        Payslips Management
      </h1>

      {/* TOGGLE */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setViewType("employee")}
          className={`px-6 py-2 rounded font-medium ${
            viewType === "employee"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          Employees
        </button>

        <button
          onClick={() => setViewType("employer")}
          className={`px-6 py-2 rounded font-medium ${
            viewType === "employer"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          Employers
        </button>

        {viewType === "employer" && (
          <button
            onClick={() => {
              resetForm();
              setEditId(null);
              setShowForm(true);
            }}
            className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            + Add Payslip
          </button>
        )}
      </div>

      {/* FORM (EMPLOYER ONLY) */}
      {showForm && viewType === "employer" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg mb-6 grid grid-cols-2 gap-4 border border-orange-200"
        >
          <select
            required
            value={form.employer_id}
            onChange={(e) =>
              setForm({ ...form, employer_id: e.target.value })
            }
            className="col-span-2 border p-2 rounded"
          >
            <option value="">Select Employer</option>
            {employers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <input
            type="month"
            required
            value={form.month_year}
            onChange={(e) =>
              setForm({ ...form, month_year: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Basic Salary"
            value={form.basic_salary}
            onChange={(e) =>
              setForm({ ...form, basic_salary: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Allowances"
            value={form.allowances}
            onChange={(e) =>
              setForm({ ...form, allowances: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Deductions"
            value={form.deductions}
            onChange={(e) =>
              setForm({ ...form, deductions: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            readOnly
            value={`₹ ${form.net_salary}`}
            className="border p-2 col-span-2 bg-orange-50 font-semibold"
          />

          <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded">
            {editId ? "Update" : "Save"}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-orange-100 text-orange-700 p-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3">ID</th>
              {viewType === "employee" ? (
                <>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Department</th>
                </>
              ) : (
                <th className="p-3">Employer</th>
              )}
              <th className="p-3">Month</th>
              <th className="p-3">Net Salary</th>
              {viewType === "employer" && <th className="p-3">Action</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : payslips.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center text-gray-500">
                  No payslips found
                </td>
              </tr>
            ) : (
              payslips.map((p) => (
                <tr key={p.id} className="border-t hover:bg-orange-50">
                  <td className="p-3">{p.id}</td>

                  {viewType === "employee" ? (
                    <>
                      <td className="p-3">{p.employee_name}</td>
                      <td className="p-3">{p.employee_code}</td>
                      <td className="p-3">{p.department}</td>
                    </>
                  ) : (
                    <td className="p-3">{p.employer_name}</td>
                  )}

                  <td className="p-3">{p.month_year}</td>
                  <td className="p-3 font-semibold">₹{p.net_salary}</td>

                  {viewType === "employer" && (
                    <td className="p-3">
                      <button
                        onClick={() => editPayslip(p)}
                        className="bg-orange-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePayslip(p.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
