import React, { useEffect, useState } from "react";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.role) return;

    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/notifications/user_notifications.php?user_type=${user.role}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => {
        setList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!user) return <p className="text-red-500">User not logged in</p>;
  if (loading) return <p>Loading notifications...</p>;
  if (!list.length) return <p>No notifications</p>;

  return (
    <div className="space-y-3">
      {list.map(n => (
        <div
          key={n.id}
          className={`p-4 border rounded ${
            n.is_read == 0 ? "bg-orange-50 border-orange-400" : "bg-white"
          }`}
        >
          <div className="flex justify-between">
            <h4 className="font-semibold">{n.title}</h4>
            <span className="text-xs text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
}