import React from "react";
import Table from "../components/Table.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { payments } from "../data/mock.js";

export default function Payments() {
  const columns = [
    { key: "id", title: "Payment ID" },
    { key: "ref", title: "Reference (Invoice)" },
    { key: "method", title: "Method" },
    { key: "amount", title: "Amount (₹)" },
    { key: "status", title: "Status", render: (v) => <StatusBadge status={v === "successful" ? "paid" : "pending"} /> },
    { key: "date", title: "Date" },
  ];

  return (
    <div className="space-y-4">
      

      <div>
        <h3 className="font-semibold mb-3">Payments list</h3>
        <Table columns={columns} data={payments} />
      </div>
    </div>
  );
}
