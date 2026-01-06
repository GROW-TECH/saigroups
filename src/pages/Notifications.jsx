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

  if (!user) return <p className="text-red-500">User not logged in</p>;
  if (loading) return <p>Loading notifications...</p>;
  if (!list.length) return <p>No notifications</p>;

  return (
    <div className="space-y-4">
      {list.map(n => (
        <div
          key={n.id}
          className={`p-4 border rounded ${
            n.is_read == 0
              ? "bg-orange-50 border-orange-400"
              : "bg-white"
          }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{n.title}</h4>
            <span className="text-xs text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </span>
          </div>

          {/* MESSAGE */}
          <p className="text-sm mt-1">{n.message}</p>

          {/* FILE ACTIONS */}
          <div className="mt-3 flex gap-4 items-center">
            {n.file_path ? (
              <>
                {/* VIEW */}
                <a
                  href={`${BASE_URL}${n.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-xs underline"
                >
                  View File
                </a>

                {/* DOWNLOAD */}
                <a
                  href={`${BASE_URL}${n.file_path}`}
                  download
                  className="text-green-600 text-xs underline"
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