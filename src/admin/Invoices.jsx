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
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    employer_user_id: "",
    invoice_no: "",
    invoice_date: "",
    amount: "",
    upload_file: null,
  });

  /* LOAD EMPLOYERS */
  useEffect(() => {
    fetch(`${API}/employers/list.php`)
      .then(res => res.json())
      .then(data => setEmployers(Array.isArray(data) ? data : []));
  }, []);

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

  /* OPEN EDIT */
  const openEdit = (inv) => {
    setEditId(inv.id);
    setForm({
      employer_user_id: inv.user_id,
      invoice_no: inv.invoice_no,
      invoice_date: inv.invoice_date,
      amount: inv.amount,
      upload_file: null,
    });
    setOpen(true);
  };

  /* CREATE / UPDATE */
  const saveInvoice = async () => {
    if (
      !form.employer_user_id ||
      !form.invoice_no ||
      !form.invoice_date ||
      !form.amount
    ) {
      alert("All fields required");
      return;
    }

    const url = editId
      ? `${API}/invoices/update.php`
      : `${API}/invoices/create.php`;

    let payload = {
      id: editId,
      user_id: form.employer_user_id,
      invoice_no: form.invoice_no,
      invoice_date: form.invoice_date,
      amount: form.amount,
    };

    if (form.upload_file) {
      payload.file_name = form.upload_file.name;
      payload.file_base64 = await fileToBase64(form.upload_file);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert(editId ? "Invoice Updated" : "Invoice Created");
      setOpen(false);
      setEditId(null);
      setForm({
        employer_user_id: "",
        invoice_no: "",
        invoice_date: "",
        amount: "",
        upload_file: null,
      });
      loadInvoices();
    } else {
      alert(data.error || "Failed");
    }
  };

  /* DELETE */
  const deleteInvoice = (id) => {
    if (!confirm("Delete this invoice?")) return;

    fetch(`${API}/invoices/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then(() => loadInvoices());
  };

  /* MARK PAID */
  const updateStatus = (invoiceNo) => {
    fetch(`${API}/invoices/update_status.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_no: invoiceNo, status: "paid" }),
    }).then(() => loadInvoices());
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Invoices</h3>
        <button
          onClick={() => {
            setEditId(null);
            setOpen(true);
          }}
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
    <div className="p-8 text-center text-gray-500">No invoices</div>
  ) : (
    <table className="w-full text-sm table-fixed">
      {/* TABLE HEAD */}
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left w-[120px]">Invoice No</th>
          <th className="px-4 py-3 text-left w-[220px]">Employer</th>
          <th className="px-4 py-3 text-right w-[120px]">Amount</th>
          <th className="px-4 py-3 text-center w-[100px]">Status</th>
          <th className="px-4 py-3 text-center w-[120px]">Date</th>
          <th className="px-4 py-3 text-center w-[220px]">Action</th>
          <th className="px-4 py-3 text-center w-[80px]">File</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody>
        {invoices.map(inv => (
          <tr key={inv.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-3 truncate">
              {inv.invoice_no}
            </td>

            <td className="px-4 py-3 truncate">
              {inv.organization_name || "—"}
            </td>

            <td className="px-4 py-3 text-right">
              ₹{Number(inv.amount).toLocaleString()}
            </td>

            <td className="px-4 py-3 text-center">
              <StatusBadge status={inv.status} />
            </td>

            <td className="px-4 py-3 text-center">
              {inv.invoice_date}
            </td>

            <td className="px-4 py-3">
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => openEdit(inv)}
                  className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
                >
                  Edit
                </button>

                {inv.status === "pending" && (
                  <button
                    onClick={() => updateStatus(inv.invoice_no)}
                    className="bg-green-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Mark Paid
                  </button>
                )}

                <button
                  onClick={() => deleteInvoice(inv.id)}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </td>

            <td className="px-4 py-3 text-center">
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
            <h4 className="font-semibold">
              {editId ? "Edit Invoice" : "Create Invoice"}
            </h4>

            <select
              className="w-full border px-3 py-2 rounded"
              value={form.employer_user_id}
              onChange={e =>
                setForm({ ...form, employer_user_id: e.target.value })
              }
            >
              <option value="">-- Select Employer --</option>
              {employers.map(emp => (
                <option key={emp.id} value={emp.user_id}>
                  {emp.organization_name} ({emp.organization_code})
                </option>
              ))}
            </select>

            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Invoice No"
              value={form.invoice_no}
              onChange={e =>
                setForm({ ...form, invoice_no: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={form.invoice_date}
              onChange={e =>
                setForm({ ...form, invoice_date: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              placeholder="Amount"
              value={form.amount}
              onChange={e =>
                setForm({ ...form, amount: e.target.value })
              }
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
                onClick={() => {
                  setOpen(false);
                  setEditId(null);
                }}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveInvoice}
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
