import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Invoices() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD ONLY LOGGED-IN USER INVOICES ---------- */
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API}/invoices/list.php?user_id=${user.id}`, {
      cache: "no-store",
    })
      .then(res => res.json())
      .then(data => {
        setInvoices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setInvoices([]);
        setLoading(false);
      });
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <h3 className="text-lg font-semibold">My Invoices</h3>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        {loading ? (
          <div className="text-gray-500 text-center py-6">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            No invoices found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              {/* ---------- TABLE HEADER ---------- */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    Invoice No
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">
                    File
                  </th>
                </tr>
              </thead>

              {/* ---------- TABLE BODY ---------- */}
              <tbody>
                {invoices.map(inv => (
                  <tr
                    key={inv.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Invoice No */}
                    <td className="px-6 py-3 text-left font-medium">
                      {inv.invoice_no}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-3 text-right">
                      ₹{Number(inv.amount).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 text-center">
                      <StatusBadge status={inv.status || "pending"} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3 text-center">
                      {inv.invoice_date}
                    </td>

                    {/* File */}
                    <td className="px-6 py-3 text-center">
                      {inv.upload_file ? (
                        <a
                          href={`${API.replace("/api", "")}/${inv.upload_file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}