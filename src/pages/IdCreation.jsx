import React, { useEffect, useState } from "react";

export default function IdCreation() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    user_id: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    epfo_number: "",
    joining_date: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [showEdit, setShowEdit] = useState(false);

  /* ---------- LOAD EMPLOYEES ---------- */
 const loadEmployees = () => {
  fetch(
    "https://projects.growtechnologies.in/srisaigroups/api/users/list.php?ts=" + Date.now(),
    { cache: "no-store" }
  )
    .then(res => res.json())
    .then(data => setList(data))
    .catch(() => setList([]));
};


  useEffect(() => {
    loadEmployees();
  }, []);

  /* ---------- CREATE ---------- */
  const createEmployee = async () => {
    if (!form.name || !form.email) {
      alert("Name and Email required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/users/create-employee.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(
        `Employee Created\nID: ${data.employee_code}\nPassword: ${data.default_password}`
      );

      setForm(emptyForm);
      loadEmployees();
    } catch (err) {
      alert(err.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = (row) => {
    console.log("Opening edit for:", row);
    setForm({
      user_id: row.user_id || "",
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      department: row.department || "",
      designation: row.designation || "",
      epfo_number: row.epfo_number || "",
      joining_date: row.joining_date || "",
    });
    setShowEdit(true);
  };

  const updateEmployee = async () => {
    if (!form.user_id) {
      alert("Invalid employee data");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/users/update-employee.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Employee updated successfully");
      setShowEdit(false);
      setForm(emptyForm);
      loadEmployees();
    } catch (err) {
      alert(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteEmployee = async (user_id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/users/delete-employee.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Employee deleted successfully");
      loadEmployees();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="p-4">
      {/* ---------- CREATE ---------- */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Create Employee</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <Input label="Department" value={form.department} onChange={v => setForm({ ...form, department: v })} />
          <Input label="Designation" value={form.designation} onChange={v => setForm({ ...form, designation: v })} />
          <Input label="EPFO Number" value={form.epfo_number} onChange={v => setForm({ ...form, epfo_number: v })} />
          <Input type="date" label="Joining Date" value={form.joining_date} onChange={v => setForm({ ...form, joining_date: v })} />
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          onClick={createEmployee}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create ID"}
        </button>
      </div>

      {/* ---------- EMPLOYEE LIST TABLE ---------- */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Employee List ({list.length})</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Employee ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Designation</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Department</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">EPFO Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Joining Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="10" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                list.map((row) => (
                  <tr key={row.user_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.employee_code || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.name || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.designation || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.department || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.email || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.phone || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{row.epfo_number || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {row.joining_date ? new Date(row.joining_date).toLocaleDateString() : '-'}
                    </td>
                   
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <div className="flex gap-2">
                        <button 
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </button>
                        <button 
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                          onClick={() => deleteEmployee(row.user_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- EDIT MODAL ---------- */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Employee</h3>
              
              <div className="space-y-4">
                <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                <Input label="Department" value={form.department} onChange={v => setForm({ ...form, department: v })} />
                <Input label="Designation" value={form.designation} onChange={v => setForm({ ...form, designation: v })} />
                <Input label="EPFO Number" value={form.epfo_number} onChange={v => setForm({ ...form, epfo_number: v })} />
                <Input type="date" label="Joining Date" value={form.joining_date} onChange={v => setForm({ ...form, joining_date: v })} />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowEdit(false);
                    setForm(emptyForm);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  onClick={updateEmployee}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- INPUT COMPONENT ---------- */
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);