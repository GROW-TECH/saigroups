import React from "react";
import Table from "../components/Table.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { epfoRequests } from "../data/mock.js";

export default function EpfoRequests() {
  const columns = [
    { key: "id", title: "Request ID" },
    { key: "employeeId", title: "Employee ID" },
    { key: "type", title: "Type" },
    { key: "status", title: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "date", title: "Date" },
  ];
  return (
    <div>
      <h3 className="font-semibold mb-3">EPFO Requests</h3>
      <Table columns={columns} data={epfoRequests} />
    </div>
  );
}
