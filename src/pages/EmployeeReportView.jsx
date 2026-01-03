import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table.jsx";
import SearchBar from "../components/SearchBar.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Reports() {
  const [q, setQ] = useState("");
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  /* LOAD EMPLOYEES FOR REPORT */
  useEffect(() => {
    fetch(`${API}/reports/employees.php`)
      .then(res => res.json())
      .then(res => setEmployees(res.data || []))
      .catch(console.error);
  }, []);

  const filtered = employees.filter(e =>
    `${e.employee_code} ${e.name} ${e.department}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const columns = [
    { key: "employee_code", title: "Employee Code" },
    { key: "name", title: "Employee Name" },
    { key: "department", title: "Department" },
    { key: "designation", title: "Designation" },
    {
      key: "action",
      title: "Action",
      render: row => (
        <button
          onClick={() => navigate(`/reports/employee/${row.employee_id}`)}
          className="text-orange-600 font-medium"
        >
          View Report
        </button>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search employee reports..."
        />
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  );
}
