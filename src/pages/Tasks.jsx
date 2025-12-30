import React, { useEffect, useState } from "react";
import Modal from "../components/Modal.jsx";

/* ---------- FILE TO BASE64 ---------- */
const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ---------- PROGRESS BAR ---------- */
const ProgressBar = ({ value }) => {
  let color = "bg-gray-400";
  if (value >= 1 && value < 40) color = "bg-red-500";
  else if (value >= 40 && value < 80) color = "bg-yellow-500";
  else if (value >= 80) color = "bg-green-600";

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${color} h-2 transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">
        {value}%
      </div>
    </div>
  );
};

/* ---------- STATUS BADGE ---------- */
const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-gray-200 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100"
      }`}
    >
      {String(status || "").replace("_", " ")}
    </span>
  );
};

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);

  const emptyForm = {
    title: "",
    description: "",
    employee_id: "",
    due_date: "",
    upload_file: null,
  };

  const [form, setForm] = useState(emptyForm);

  const isEmployer = user.role?.toLowerCase().includes("employer");
  const isEmployee = user.role?.toLowerCase().includes("employee");

  /* ---------- LOAD TASKS ---------- */
  const loadTasks = () => {
    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/tasks/list.php?user_id=${user.id}&role=${user.role}&ts=${Date.now()}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]));
  };

  /* ---------- LOAD EMPLOYEES ---------- */
  const loadEmployees = () => {
    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/users/list.php?ts=${Date.now()}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(setEmployees)
      .catch(() => setEmployees([]));
  };

  useEffect(() => {
    if (isEmployer) loadEmployees();
    loadTasks();
  }, []);

  /* ---------- CREATE TASK ---------- */
  const createTask = async () => {
    if (!form.title || !form.employee_id) {
      alert("Title & employee required");
      return;
    }

    let payload = {
      employer_id: user.id,
      title: form.title,
      description: form.description,
      employee_id: form.employee_id,
      due_date: form.due_date,
    };

    if (form.upload_file) {
      payload.file_name = form.upload_file.name;
      payload.file_base64 = await fileToBase64(form.upload_file);
    }

    const res = await fetch(
      "https://projects.growtechnologies.in/srisaigroups/api/tasks/create.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    if (!result.success) {
      alert(result.error || "Failed to save task");
      return;
    }

    setOpen(false);
    setForm(emptyForm);
    loadTasks();
  };

  /* ---------- UPDATE PROGRESS (LOCK WHEN COMPLETED) ---------- */
  const updateProgress = async (task, progress) => {
    if (task.status === "completed") return; // 🚫 STOP UPDATE

    await fetch(
      "https://projects.growtechnologies.in/srisaigroups/api/tasks/update-progress.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task.id,
          progress,
        }),
      }
    );

    loadTasks();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Task assign board</h3>
        {isEmployer && (
          <button className="btn-primary" onClick={() => setOpen(true)}>
            Assign task
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Task ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Assignee</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">File</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">T-{task.id}</td>
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{task.employee_name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>

                  {/* PROGRESS */}
                  <td className="px-4 py-3 w-56">
                    <ProgressBar value={Number(task.progress_percent || 0)} />

                    {isEmployee && task.status !== "completed" && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue={Number(task.progress_percent || 0)}
                        className="w-full mt-1"
                        onMouseUp={e =>
                          updateProgress(task, e.target.value)
                        }
                      />
                    )}

                    {task.status === "completed" && (
                      <p className="text-xs text-green-600 mt-1">
                        {/* ✔ Progress locked */}
                      </p>
                    )}
                  </td>

                  {/* FILE */}
                  <td className="px-4 py-3">
                    {task.upload_file ? (
                      <div className="space-x-3 text-sm">
                        <a
                          href={`https://projects.growtechnologies.in/srisaigroups/${task.upload_file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                        <a
                          href={`https://projects.growtechnologies.in/srisaigroups/${task.upload_file}`}
                          download
                          className="text-green-600 underline"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal open={open} title="Assign task" onClose={() => setOpen(false)}>
        <div className="space-y-3">

          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            className="input"
            value={form.employee_id}
            onChange={e =>
              setForm({
                ...form,
                employee_id: e.target.value ? Number(e.target.value) : ""
              })
            }
          >
            <option value="">Select employee</option>
            {employees.map(e => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input"
            value={form.due_date}
            onChange={e =>
              setForm({ ...form, due_date: e.target.value })
            }
          />

          <input
            type="file"
            className="input"
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 5 * 1024 * 1024) {
                alert("File must be under 5 MB");
                return;
              }
              setForm({ ...form, upload_file: file });
            }}
          />

          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={createTask}>
              Save
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}
