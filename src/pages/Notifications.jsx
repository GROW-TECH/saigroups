import React from "react";
import { notifications } from "../data/mock.js";

export default function Notifications() {
  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div key={n.id} className="card p-4">
          <div className="flex justify-between">
            <h4 className="font-semibold">{n.title}</h4>
            <span className="text-xs text-gray-500">{n.date}</span>
          </div>
          <p className="text-sm text-gray-700">{n.body}</p>
        </div>
      ))}
    </div>
  );
}
