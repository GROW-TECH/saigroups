import React, { useEffect, useState } from "react";

const BASE = "https://projects.growtechnologies.in/srisaigroups/api";

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    user_id: ""
  });

  /* LOAD USERS + NOTIFICATIONS */
  const loadData = async () => {
    try {
      const [usersRes, notifRes] = await Promise.all([
        fetch(`${BASE}/users/list.php`),
        fetch(`${BASE}/notifications/list.php`)
      ]);

      setUsers(await usersRes.json());
      setNotifications(await notifRes.json());
    } catch (err) {
      console.error("Load error", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* SUBMIT NOTIFICATION (CREATE OR UPDATE) */
  const submit = async () => {
    if (!form.title || !form.message || !form.user_id) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const url = editMode 
        ? `${BASE}/notifications/update.php` 
        : `${BASE}/notifications/add.php`;
      
      const body = editMode 
        ? { ...form, id: editId }
        : form;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.status === "success") {
        setForm({ title: "", message: "", user_id: "" });
        setEditMode(false);
        setEditId(null);
        loadData();
        alert(editMode ? "Notification updated!" : "Notification created!");
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
      user_id: notification.user_id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* CANCEL EDIT */
  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setForm({ title: "", message: "", user_id: "" });
  };

  /* DELETE NOTIFICATION */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const res = await fetch(`${BASE}/notifications/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (data.status === "success") {
        loadData();
        alert("Notification deleted successfully!");
      } else {
        alert(data.error || "Failed to delete notification");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting notification");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <p className="text-sm text-gray-500">Send and manage user notifications</p>
          </div>
        </div>

        {/* ADD/EDIT NOTIFICATION FORM */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className={`p-4 rounded-t-lg ${editMode ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
            <h2 className="text-lg font-semibold text-white">
              {editMode ? ' Edit Notification' : 'Create New Notification'}
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
                Select Recipient
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-white"
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
              >
                <option value="">-- Select User --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.user_type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submit}
                disabled={loading}
                className={`flex-1 ${editMode ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'} text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition`}
              >
                {loading ? "Processing..." : editMode ? "✏️ Update Notification" : "✉️ Create Notification"}
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
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
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
                        <div className="font-semibold text-gray-900">{n.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-md">
                          {n.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="text-sm font-medium text-gray-900">
                            {n.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          n.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {n.role || 'employee'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          📅 {formatDate(n.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          n.is_read === 0 || n.is_read === '0'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {n.is_read === 0 || n.is_read === '0' ? '✓ Unread' : '✓ Read'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(n)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                            title="Edit"
                          >
                             Edit
                          </button>
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                            title="Delete"
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