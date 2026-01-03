import React from "react";
export default function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
  };
  return <span className={`badge ${map[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
}
