import React, { useEffect, useState } from "react";

const BASE = "https://projects.growtechnologies.in/srisaigroups/api";

/* ---------- FILE TO BASE64 ---------- */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    user_type: "employee",
    file: null
  });

  const loadData = async () => {
    try {
      const res = await fetch(
        `${BASE}/notifications/list.php?ts=${Date.now()}`,
        { cache: "no-store" }
      );

      const json = await res.json();
      console.log("API Response:", json);

      if (json.status === "success" && Array.isArray(json.data)) {
        setNotifications(json.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Load error", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* HANDLE FILE SELECTION */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10 MB");
      return;
    }

    // Validate file type
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx'];
    if (!allowed.includes(ext)) {
      alert("Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX");
      return;
    }

    setForm({ ...form, file });
  };

  /* SUBMIT NOTIFICATION (CREATE OR UPDATE) */
  const submit = async () => {
    if (!form.title || !form.message || !form.user_type) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      let payload = {
        title: form.title,
        message: form.message,
        user_type: form.user_type
      };

      // Add file if selected
      if (form.file) {
        const base64 = await fileToBase64(form.file);
        payload.file = {
          name: form.file.name,
          base64: base64
        };
      }

      const url = editMode 
        ? `${BASE}/notifications/update.php` 
        : `${BASE}/notifications/add.php`;
      
      if (editMode) {
        payload.id = editId;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.status === "success") {
        setForm({ title: "", message: "", user_type: "employee", file: null });
        setEditMode(false);
        setEditId(null);
        loadData();
        alert(data.message || (editMode ? "Notification updated!" : "Notification created!"));
      } else {
        alert(data.error || "Failed to process notification");
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Error processing notification");
    } finally {
      setLoading(false);
    }
  };

  /* EDIT NOTIFICATION */
  const handleEdit = (notification) => {
    setEditMode(true);
    setEditId(notification.id);
    setForm({
      title: notification.title,
      message: notification.message,
      user_type: notification.user_type,
      file: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* CANCEL EDIT */
  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setForm({ title: "", message: "", user_type: "employee", file: null });
  };

  /* DELETE NOTIFICATION */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const res = await fetch(`${BASE}/notifications/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (data.success === true) {
        alert("Notification deleted successfully!");
        loadData();
      } else {
        alert(data.message || data.error || "Failed to delete notification");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Server error while deleting");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-3 rounded-lg">
            <span className="text-2xl">🔔</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications Management</h1>
            <p className="text-sm text-gray-500">Broadcast notifications to employees or employers</p>
          </div>
        </div>

        {/* ADD/EDIT NOTIFICATION FORM */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className={`p-4 rounded-t-lg ${editMode ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
            <h2 className="text-lg font-semibold text-white">
              {editMode ? '✏️ Edit Notification' : '✉️ Create New Notification'}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="Enter notification title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Enter your message here..."
                rows="4"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach File (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="notification-file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="notification-file"
                  className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-orange-400 transition-all bg-gray-50"
                >
                  {form.file ? (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-700 truncate max-w-[300px]">{form.file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setForm({ ...form, file: null });
                        }}
                        className="ml-2 text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Click to attach file (PDF, DOC, Image, Excel)
                    </div>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send To
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-white"
                value={form.user_type}
                onChange={e => setForm({ ...form, user_type: e.target.value })}
              >
                <option value="employee">All Employees</option>
                <option value="employer">All Employers</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submit}
                disabled={loading}
                className={`flex-1 ${editMode ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'} text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition`}
              >
                {loading ? "Processing..." : editMode ? "✏️ Update Notification" : "✉️ Send Notification"}
              </button>
              
              {editMode && (
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS TABLE */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
            <h2 className="text-lg font-semibold text-white">
              🔔 All Notifications ({notifications.length})
            </h2>
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500 text-lg">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first notification above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Attachment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sent To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((n, idx) => (
                    <tr key={n.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{n.title || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-md">
                          {n.message || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {n.file_path ? (
                          <a
                            href={`${BASE.replace('/api', '')}/${n.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            View File
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">No file</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          n.user_type === 'employer' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {n.user_type === 'employer' ? '👔 All Employers' : '👥 All Employees'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(n.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(n)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                          >
                            Delete
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