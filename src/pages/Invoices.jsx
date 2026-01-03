import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

/* ---------- FILE TO BASE64 ---------- */
const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Invoices() {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nextInvoiceNo, setNextInvoiceNo] = useState("INV001");

  const [form, setForm] = useState({
    invoice_date: "",
    amount: "",
    upload_file: null
  });

  /* ---------- LOAD USER ---------- */
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  /* ---------- LOAD INVOICES ---------- */
  const loadInvoices = () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/invoices/list.php?employer_id=${user.id}&_=${Date.now()}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data || [];
        setInvoices(list);
        setLoading(false);
      })
      .catch(() => {
        setInvoices([]);
        setLoading(false);
      });
  };

  /* ---------- LOAD NEXT INVOICE NO ---------- */
  const loadNextInvoiceNo = () => {
    if (!user?.id) return;

    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/invoices/next_invoice_no.php?employer_id=${user.id}&_=${Date.now()}`,
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(d => setNextInvoiceNo(d.invoice_no || "INV001"))
      .catch(() => setNextInvoiceNo("INV001"));
  };

  useEffect(() => {
    loadInvoices();
  }, [user]);

  useEffect(() => {
    if (open) loadNextInvoiceNo();
  }, [open]);

  /* ---------- CREATE INVOICE (WITH FILE) ---------- */
  const createInvoice = async () => {
    let payload = {
      employer_id: user.id,
      invoice_date: form.invoice_date,
      amount: form.amount
    };

    if (form.upload_file) {
      payload.file_name = form.upload_file.name;
      payload.file_base64 = await fileToBase64(form.upload_file);
    }

    fetch(
      "https://projects.growtechnologies.in/srisaigroups/api/invoices/create.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )
      .then(res => res.json())
      .then(() => {
        setOpen(false);
        setForm({ invoice_date: "", amount: "", upload_file: null });
        loadInvoices();
      });
  };

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = (invoiceNo, status) => {
    fetch(
      "https://projects.growtechnologies.in/srisaigroups/api/invoices/update_status.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employer_id: user.id,
          invoice_no: invoiceNo,
          status
        })
      }
    )
      .then(res => res.json())
      .then(() => loadInvoices());
  };

  if (!user) return <div className="p-4">Loading user...</div>;

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Invoices</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Create Invoice
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No invoices found</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left">Invoice No</th>
                <th className="px-5 py-3 text-right">Amount (₹)</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Invoice Date</th>
                <th className="px-5 py-3 text-center">Action</th>
                <th className="px-5 py-3 text-center">Invoice</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{inv.id}</td>

                  <td className="px-5 py-3 text-right">
                    ₹{Number(inv.amount).toLocaleString()}
                  </td>

                  <td className="px-5 py-3">
                    <StatusBadge status={inv.status || "pending"} />
                  </td>

                  <td className="px-5 py-3">{inv.date}</td>

                  <td className="px-5 py-3 text-center">
                    {inv.status === "pending" ? (
                      <button
                        onClick={() => updateStatus(inv.id, "paid")}
                        className="text-xs bg-green-600 text-white px-4 py-1.5 rounded-md"
                      >
                        Mark as Paid
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* FILE VIEW + DOWNLOAD */}
                  <td className="px-5 py-3 text-center space-x-3">
                    {inv.upload_file ? (
                      <>
                        <a
                          href={`https://projects.growtechnologies.in/srisaigroups/${inv.upload_file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline text-xs"
                        >
                          View
                        </a>
                        <a
                          href={`https://projects.growtechnologies.in/srisaigroups/${inv.upload_file}`}
                          download
                          className="text-green-600 underline text-xs"
                        >
                          Download
                        </a>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-96 rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-lg">Create Invoice</h4>

            <input
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={nextInvoiceNo}
            />

            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={form.invoice_date}
              onChange={e =>
                setForm({ ...form, invoice_date: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Amount"
              value={form.amount}
              onChange={e =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            {/* UPLOAD FILE */}
            <input
              type="file"
              className="w-full border rounded px-3 py-2 text-sm"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                  alert("File must be under 5 MB");
                  return;
                }

                setForm({ ...form, upload_file: file });
              }}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createInvoice}
                className="bg-indigo-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
