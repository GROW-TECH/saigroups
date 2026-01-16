import React, { useEffect, useState } from "react";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = "https://projects.growtechnologies.in/srisaigroups/";

  /* ---------- LOAD NOTIFICATIONS ---------- */
  useEffect(() => {
    if (!user?.role) return;

    fetch(
      `${BASE_URL}api/notifications/user_notifications.php?user_type=${user.role}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => {
        setList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  /* ---------- MARK NOTIFICATIONS AS VISITED ---------- */
  useEffect(() => {
    if (list.length > 0) {
      const notificationIds = list.map(n => n.id).join(',');
      localStorage.setItem('visitedNotificationIds', notificationIds);
      localStorage.setItem('lastVisitedNotificationsTime', Date.now().toString());
      
      // 🔥 Dispatch custom event to notify Sidebar
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { 
        detail: 'visitedNotificationIds' 
      }));
    }
  }, [list]);

  if (!user) return <p className="text-red-500">User not logged in</p>;
  if (loading) return <p className="p-6">Loading notifications...</p>;
  if (!list.length) return <p className="p-6">No notifications</p>;

  return (
    <div id="notifications" className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">All Notifications</h2>
      
      {list.map(n => (
        <div
          key={n.id}
          className={`p-4 border rounded-lg shadow-sm ${
            n.is_read == 0
              ? "bg-orange-50 border-orange-400"
              : "bg-white border-gray-200"
          }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">{n.title}</h4>
            <span className="text-xs text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </span>
          </div>

          {/* MESSAGE */}
          <p className="text-sm mt-2 text-gray-700">{n.message}</p>

          {/* FILE ACTIONS */}
          <div className="mt-3 flex gap-4 items-center">
            {n.file_path ? (
              <>
                <a
                  href={`${BASE_URL}${n.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm underline hover:text-blue-800 font-medium"
                >
                  View File
                </a>
                <a
                  href={`${BASE_URL}${n.file_path}`}
                  download
                  className="text-green-600 text-sm underline hover:text-green-800 font-medium"
                >
                  Download
                </a>
              </>
            ) : (
              <span className="text-gray-400 text-xs">No file</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}