import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const EMPLOYER_ID = 7;
  const BASE_URL = "https://projects.growtechnologies.in/srisaigroups/";

  /* ---------- LOAD INVOICES ---------- */
  useEffect(() => {
    fetch(`${BASE_URL}api/invoices/list.php?employer_id=${EMPLOYER_ID}`, {
      cache: "no-store"
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
  }, []);

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Invoices</h3>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Invoice No</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Invoice Date</th>
                <th className="px-5 py-3 text-left">Invoice File</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-t">
                  <td className="px-5 py-3">{inv.id}</td>

                  <td className="px-5 py-3 text-right">
                    {Number(inv.amount).toLocaleString()}
                  </td>

                  <td className="px-5 py-3">
                    <StatusBadge status={inv.status} />
                  </td>

                  <td className="px-5 py-3">{inv.date}</td>

                  {/* Invoice File */}
                  <td className="px-5 py-3">
                    {inv.upload_file ? inv.upload_file : "----"}
                  </td>

                  {/* Action – ALWAYS SHOW DOWNLOAD */}
                  <td className="px-5 py-3 text-center">
                    <a
                      href={
                        inv.upload_file
                          ? `${BASE_URL}${inv.upload_file}`
                          : "#"
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      onClick={e => {
                        if (!inv.upload_file) {
                          e.preventDefault();
                          alert("Invoice file not uploaded by admin yet");
                        }
                      }}
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}