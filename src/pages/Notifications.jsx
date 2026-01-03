import React, { useEffect, useState } from "react";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ get logged user from localStorage / context
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id || !user?.role) return;

    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/notifications/user_notifications.php?user_id=${user.id}&role=${user.role}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => {
        setList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (!user) {
    return <p className="text-red-500">User not logged in</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading notifications...</p>;
  }

  if (!list.length) {
    return <p className="text-gray-500">No notifications</p>;
  }

  return (
    <div className="space-y-3">
      {list.map(n => (
        <div
          key={n.id}
          className={`card p-4 border rounded-md ${
            n.is_read == 0
              ? "border-orange-400 bg-orange-50"
              : "border-gray-200"
          }`}
        >
          <div className="flex justify-between">
            <h4 className="font-semibold">{n.title}</h4>
            <span className="text-xs text-gray-500">
              {new Date(n.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-700">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
