import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD PAYMENTS (VIEW ONLY) ---------- */
  useEffect(() => {
    fetch(`${API}/Payment/list.php`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setPayments(data.data);
        } else {
          setPayments([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPayments([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payments</h3>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {loading ? (
          <div className="text-gray-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-gray-500">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Transaction</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{p.id}</td>

                    <td className="p-3 capitalize">
                      {p.payment_method}
                    </td>

                    <td className="p-3">
                      {p.transaction_id || "-"}
                    </td>

                    <td className="p-3 text-right font-semibold">
                      ₹ {Number(p.amount).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="p-3">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>

                    {/* ACTION COLUMN (FORMAT SAME AS YOU WANT) */}
                    <td className="p-3 text-center">
                      <a
                        href={`${API}/Payment/download_excel.php`}
                        className="text-green-600 hover:underline text-sm font-medium"
                      >
                        Download
                      </a>
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