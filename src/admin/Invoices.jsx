import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

/* FILE → BASE64 */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    invoice_no: "",
    invoice_date: "",
    amount: "",
    upload_file: null,
  });

  /* LOAD INVOICES */
  const loadInvoices = () => {
    setLoading(true);
    fetch(`${API}/invoices/list.php?_=${Date.now()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setInvoices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setInvoices([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  /* CREATE INVOICE */
  const createInvoice = async () => {
    if (!form.invoice_no || !form.invoice_date || !form.amount) {
      alert("Invoice number, date and amount are required");
      return;
    }

    let payload = {
      invoice_no: form.invoice_no,
      invoice_date: form.invoice_date,
      amount: form.amount,
    };

    if (form.upload_file) {
      payload.file_name = form.upload_file.name;
      payload.file_base64 = await fileToBase64(form.upload_file);
    }

    const res = await fetch(`${API}/invoices/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Invoice created successfully");
      setOpen(false);
      setForm({
        invoice_no: "",
        invoice_date: "",
        amount: "",
        upload_file: null,
      });
      loadInvoices();
    } else {
      alert(data.error || "Failed to create invoice");
    }
  };

  /* UPDATE STATUS */
  const updateStatus = (invoiceNo, status) => {
    fetch(`${API}/invoices/update_status.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_no: invoiceNo, status }),
    })
      .then(res => res.json())
      .then(() => loadInvoices());
  };

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
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No invoices found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Invoice No</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-center">Action</th>
                <th className="px-5 py-3 text-center">File</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-t">
                  <td className="px-5 py-3 font-medium">{inv.invoice_no}</td>
                  <td className="px-5 py-3 text-right">
                    ₹{Number(inv.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={inv.status || "pending"} />
                  </td>
                  <td className="px-5 py-3">{inv.invoice_date}</td>
                  <td className="px-5 py-3 text-center">
                    {inv.status === "pending" ? (
                      <button
                        onClick={() => updateStatus(inv.invoice_no, "paid")}
                        className="bg-green-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {inv.upload_file ? (
                      <a
                        href={`${API.replace("/api", "")}/${inv.upload_file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        View
                      </a>
                    ) : (
                      "—"
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
            <h4 className="font-semibold">Create Invoice</h4>

            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Invoice No"
              value={form.invoice_no}
              onChange={e => setForm({ ...form, invoice_no: e.target.value })}
            />

            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={form.invoice_date}
              onChange={e => setForm({ ...form, invoice_date: e.target.value })}
            />

            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />

            <input
              type="file"
              className="w-full border px-3 py-2 rounded text-sm"
              onChange={e =>
                setForm({ ...form, upload_file: e.target.files[0] })
              }
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
