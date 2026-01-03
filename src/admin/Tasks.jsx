import React, { useEffect, useState } from "react";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

/* ---------- STATUS BADGE ---------- */
const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-orange-100 text-orange-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default function Tasks() {
  /* ---------- ADMIN / EMPLOYER DATA ---------- */
  const admin = JSON.parse(localStorage.getItem("admin")) || {};
  const userId = admin.id;
  const role = admin.role || "employer";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- LOAD TASKS ---------- */
  useEffect(() => {
    if (!userId) {
      setError("Please login again");
      setLoading(false);
      return;
    }

    fetch(
      `${API}/admin/tasks/list.php?user_id=${userId}&role=${role}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("TASK API DATA:", data);
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [userId, role]);

  /* ---------- UI STATES ---------- */
  if (loading)
    return (
      <p className="text-orange-600 font-medium">
        Loading tasks...
      </p>
    );

  if (error)
    return (
      <p className="text-red-600 font-medium">
        {error}
      </p>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-orange-200">
      <h2 className="text-lg font-semibold mb-4 text-orange-600">
        Task List
      </h2>

      <table className="w-full text-sm border border-orange-200 rounded overflow-hidden">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="border border-orange-300 p-3 text-left">Title</th>
            <th className="border border-orange-300 p-3 text-left">Employer</th>
            <th className="border border-orange-300 p-3 text-left">Employee</th>
            <th className="border border-orange-300 p-3 text-left">Status</th>
            <th className="border border-orange-300 p-3 text-left">Progress</th>
            <th className="border border-orange-300 p-3 text-left">Due Date</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="text-center p-6 text-gray-500"
              >
                No tasks found
              </td>
            </tr>
          ) : (
            tasks.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-orange-50 transition"
              >
                <td className="border p-3">
                  {t.title}
                </td>

                <td className="border p-3">
                  {t.employer_name}
                </td>

                {/* EMPLOYEE NAME */}
                <td className="border p-3">
                  {t.employee_name || "Not Assigned"}
                </td>

                <td className="border p-3">
                  <StatusBadge status={t.status} />
                </td>

                <td className="border p-3 font-medium">
                  {t.progress_percent}%
                </td>

                <td className="border p-3">
                  {t.due_date}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
