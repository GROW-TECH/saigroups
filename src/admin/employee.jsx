import React, { useEffect, useState } from "react";

// Use production API directly (works from anywhere)
const API = "https://projects.growtechnologies.in/srisaigroups/api/admin/employees";

export default function AdminEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 employee / employer filter
  const [type, setType] = useState("employee");

 const [form, setForm] = useState({
  user_type: "employee",
  name: "",
  email: "",
  phone: "",
  password: "",
  status: 1,

  // Employee
employee_code: "",
department: "",
designation: "",
joining_date: "",
epfo_number: "",
phone_no: "",
website: "",
esic_number: "",
balance: "",


  // Employer
  organization_name: "",
  organization_code: "",
  address: "",
  gst_number: "",
  phone_no: "",
  website: "",
  employer_epfo_number: "",
  esic_number: "",
  balance: "",
  Digital_key: "",
});


  /* ================= AUTO GENERATE CODES ================= */
  // const generateEmployeeCode = () => {
  //   const prefix = "EMP";
  //   const random = Math.floor(10000 + Math.random() * 90000); // 5 digit random
  //   return `${prefix}${random}`;
  // };

  // const generateEPFONumber = () => {
  //   const prefix = "EPFO";
  //   const random = Math.floor(100000 + Math.random() * 900000); // 6 digit random
  //   return `${prefix}${random}`;
  // };

  // const generateOrganizationCode = () => {
  //   const prefix = "ORG";
  //   const random = Math.floor(10000 + Math.random() * 90000); // 5 digit random
  //   return `${prefix}${random}`;
  // };

  /* ================= LOAD USERS ================= */
  const loadEmployees = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/list.php?type=${type}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      console.log("USERS FROM API:", data);

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [type]); // 🔴 reload when type changes

  /* ================= ADD / UPDATE ================= */
 const handleSubmit = async (e) => {
  e.preventDefault();

  const url = editId
    ? `${API}/update.php`
    : `${API}/create.php`;

  const payload = {
    id: editId,
    user_type: type,
    name: form.name,
    email: form.email,
    phone: form.phone,
    password: form.password,
    status: form.status,

    // employee
    department: form.department,
    designation: form.designation,
    joining_date: form.joining_date,
    epfo_number: form.epfo_number,

    // employer
    organization_name: form.organization_name,
    address: form.address,
    phone_no: form.phone_no,
    website: form.website,
    employer_epfo_number: form.employer_epfo_number,
    esic_number: form.esic_number,
    gst_number: form.gst_number,
    balance: form.balance,
    Digital_key: form.Digital_key,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || data.message || "Failed");
    return;
  }

  alert(editId ? "Updated successfully" : "Created successfully");
};


  /* ================= RESET FORM ================= */
  const resetForm = () => {
  setForm({
  user_type: type,
  name: "",
  email: "",
  phone: "",
  password: "",
  status: 1,

  // Employee
  employee_code: "",
  department: "",
  designation: "",
  joining_date: "",
  epfo_number: "",

  // Employer
  organization_name: "",
  organization_code: "",
  address: "",
  gst_number: "",
  phone_no: "",
  website: "",
  employer_epfo_number: "",
  esic_number: "",
  balance: "",
  Digital_key: "",
});

};


  /* ================= OPEN ADD FORM ================= */
  const openAddForm = () => {
    setShowForm(true);
    setEditId(null);
    
    // Auto-generate codes when opening form
  const newForm = {
  user_type: type,
  name: "",
  email: "",
  phone: "",
  password: "",
  status: 1,

  // Employee
  employee_code: "",
  department: "",
  designation: "",
  joining_date: "",
  epfo_number: "",

  // Employer
  organization_name: "",
  organization_code: "",
  address: "",
  gst_number: "",
  phone_no: "",
  website: "",
  employer_epfo_number: "",
  esic_number: "",
  balance: "",
  Digital_key: "",
};

    
    setForm(newForm);
  };

  /* ================= EDIT ================= */
  const editEmployee = (emp) => {
  setEditId(emp.id);

  setForm(
    emp.user_type === "employee"
      ? {
          user_type: "employee",
          name: emp.name,
          email: emp.email,
          phone: emp.phone || "",
          password: "",
          status: emp.status,

          // ✅ ONLY employee columns
       employee_code: emp.employee_code || "",
department: emp.department || "",
designation: emp.designation || "",
joining_date: emp.joining_date || "",
epfo_number: emp.epfo_number || "",
phone_no: emp.phone_no || "",
website: emp.website || "",
esic_number: emp.esic_number || "",
balance: emp.balance || "",

        }
      : {
          user_type: "employer",
          name: emp.name,
          email: emp.email,
          phone: emp.phone || "",
          password: "",
          status: emp.status,

          // ✅ employer columns
          organization_name: emp.organization_name || "",
          organization_code: emp.organization_code || "",
          address: emp.address || "",
          gst_number: emp.gst_number || "",
          phone_no: emp.phone_no || "",
          website: emp.website || "",
          employer_epfo_number: emp.epfo_number || "",
          esic_number: emp.esic_number || "",
          balance: emp.balance || "",
          Digital_key: emp.Digital_key || "",
        }
  );

  setShowForm(true);
};



  /* ================= DELETE ================= */
  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      // Using POST instead of DELETE for better server compatibility
      const res = await fetch(
        `${API}/delete.php?id=${id}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        console.error("Delete Error:", data);
        return;
      }

      alert("User deleted successfully!");
      loadEmployees();

    } catch (err) {
      console.error("Delete Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Users (Employee / Employer)
        </h1>

     <button
  onClick={openAddForm}
  className="bg-blue-600 hover:bg-blue-700 text-white
             px-5 py-2.5 rounded-lg shadow-sm transition-colors
             w-full sm:w-auto"
>
  + Add User
</button>


      </div>

      {/* 🔹 FILTER */}
      <div className="mb-6">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setShowForm(false); // Close form when switching types
          }}
          className="border border-gray-300 p-2.5 rounded-lg bg-white shadow-sm
           w-full sm:w-64"

        >
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
        </select>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6
           grid grid-cols-1 md:grid-cols-2 gap-4"

        >
          <h2 className="col-span-1 md:col-span-2 text-xl font-semibold text-gray-700 mb-2">

            {editId ? "Edit" : "Add New"} {type === "employee" ? "Employee" : "Employer"}
          </h2>

          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter email"
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              placeholder="Enter phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {!editId && <span className="text-red-500">*</span>}
            </label>
            <input
              placeholder={editId ? "Leave blank to keep current" : "Enter password"}
              type="password"
              required={!editId}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* ========== EMPLOYEE FIELDS ========== */}
          {type === "employee" && (
            <>
              {/* EMPLOYEE CODE – BACKEND GENERATED */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Employee Code
  </label>

  <input
    value={form.employee_code || "Auto generated"}
    disabled
    className="w-full border border-gray-300 p-2.5 rounded-lg
               bg-gray-100 text-gray-700 cursor-not-allowed"
  />
</div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  placeholder="Enter department"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  placeholder="Enter designation"
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={form.joining_date}
                  onChange={(e) =>
                    setForm({ ...form, joining_date: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>


<div>
  <label>Website</label>
  <input
    value={form.website || ""}
    onChange={e => setForm({ ...form, website: e.target.value })}
    className="input"
  />
</div>

<div>
  <label>ESIC Number</label>
  <input
    value={form.esic_number || ""}
    onChange={e => setForm({ ...form, esic_number: e.target.value })}
    className="input"
  />
</div>

<div>
  <label>Balance</label>
  <input
    type="number"
    value={form.balance || ""}
    onChange={e => setForm({ ...form, balance: e.target.value })}
    className="input"
  />
</div>

              <div className="col-span-1 md:col-span-2">

  <label className="block text-sm font-medium text-gray-700 mb-1">
    EPFO Number
  </label>

  <input
    value={form.epfo_number || "Auto generated"}
    disabled
    className="w-full border border-gray-300 p-2.5 rounded-lg
               bg-gray-100 text-gray-700 cursor-not-allowed"
  />
</div>

            </>
          )}

          {/* ========== EMPLOYER FIELDS ========== */}
         {type === "employer" && (
  <>
    <div>
      <label>Company Name</label>
      <input
        value={form.organization_name}
        onChange={e => setForm({ ...form, organization_name: e.target.value })}
        className="input"
      />
    </div>

    <div>
      <label>Organization Code</label>
      <input value="Auto generated" disabled className="input bg-gray-100" />
    </div>

    

    <div>
      <label>Website</label>
      <input
        value={form.website}
        onChange={e => setForm({ ...form, website: e.target.value })}
        className="input"
      />
    </div>

    <div>
      <label>EPFO Number</label>
      <input
        value={form.employer_epfo_number}
        onChange={e => setForm({ ...form, employer_epfo_number: e.target.value })}
        className="input"
      />
    </div>

    <div>
      <label>ESIC Number</label>
      <input
        value={form.esic_number}
        onChange={e => setForm({ ...form, esic_number: e.target.value })}
        className="input"
      />
    </div>

    <div>
      <label>GST Number</label>
      <input
        value={form.gst_number}
        onChange={e => setForm({ ...form, gst_number: e.target.value })}
        className="input"
      />
    </div>

    <div>
      <label>Balance</label>
      <input
        type="number"
        value={form.balance}
        onChange={e => setForm({ ...form, balance: e.target.value })}
        className="input"
      />
    </div>
    <div>
  <label>Digital Key</label>
  <input
    value={form.Digital_key}
    onChange={e =>
      setForm({ ...form, Digital_key: e.target.value })
    }
    className="input"
type="date"  />
</div>

    <div className="col-span-2">
      <label>Address</label>
      <textarea
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
        className="input"
      />
    </div>
  </>
)}


         <div className="col-span-1 md:col-span-2
                flex flex-col sm:flex-row gap-3 mt-4">

            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors font-medium"
            >
              {editId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                
                {/* Employee Columns */}
                {type === "employee" && (
                  <>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Employee Code</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Department</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Designation</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Website</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">ESIC</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                  </>
                )}
                
                {/* Employer Columns */}
                {type === "employer" && (
                  <>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Organization</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Org Code</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">GST Number</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
  Digital Key
</th>

                    {/* <th className="p-3 text-left text-sm font-semibold text-gray-700">Digital Key</th> */}
                  </>
                )}
                
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 capitalize text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      emp.user_type === 'employee' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {emp.user_type}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{emp.name}</td>
                  <td className="p-3 text-sm text-gray-700">{emp.email}</td>
                  <td className="p-3 text-sm text-gray-700">{emp.phone || "-"}</td>
                  
                  {/* Employee Data */}
                  {type === "employee" && (
                    <>
                      <td className="p-3 text-sm text-gray-700">{emp.employee_code || "-"}</td>
                      <td className="p-3 text-sm text-gray-700">{emp.department || "-"}</td>
                      <td className="p-3 text-sm text-gray-700">{emp.designation || "-"}</td>
                      <td className="p-3 text-sm text-gray-700">{emp.website || "-"}</td>
                      <td className="p-3 text-sm text-gray-700">{emp.esic_number || "-"}</td>
                      <td className="p-3 text-sm text-gray-700">{emp.balance || "0"}</td>
                    </>
                  )}
                  
                  {/* Employer Data */}
                  {type === "employer" && (
                    <>
                      <td className="p-3 text-sm text-gray-700">
  {emp.organization_name || "-"}
</td>
<td className="p-3 text-sm text-gray-700">
  {emp.organization_code || "-"}
</td>
<td className="p-3 text-sm text-gray-700">
  {emp.gst_number || "-"}
</td>
<td className="p-3 text-sm text-gray-700">
  {emp.balance || "-"}
</td>
<td className="p-3 text-sm text-gray-700">
  {emp.Digital_key || "-"}
</td>

                    </>
                  )}
                  
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {emp.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editEmployee(emp)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan={type === "employee" ? "10" : "10"}
                    className="p-8 text-center text-gray-500"
                  >
                    No users found. Click "+ Add User" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}