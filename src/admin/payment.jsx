import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    payment_method: "Cash",
    amount: "",
    transaction_id: "",
    status: "paid",
  });

  const showTxn = form.payment_method !== "Cash";

  /* LOAD */
  const loadPayments = () => {
    setLoading(true);
    fetch(`${API}/Payment/list.php?_=${Date.now()}`)
      .then(r => r.json())
      .then(res => setPayments(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPayments();
  }, []);

  /* ADD / UPDATE */
  const submit = async () => {
    if (!form.amount) return alert("Amount required");
    if (showTxn && !form.transaction_id)
      return alert("Transaction ID required");

    const url = editId
      ? `${API}/Payment/update.php`
      : `${API}/Payment/create.php`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId,
        payment_method: form.payment_method,
        amount: form.amount,
        transaction_id: showTxn ? form.transaction_id : null,
        status: form.status,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert(editId ? "✅ Payment updated" : "✅ Payment added");
      resetForm();
      loadPayments();
    } else {
      alert(data.message || "Failed");
    }
  };

  /* EDIT */
  const editPayment = p => {
    setEditId(p.id);
    setForm({
      payment_method: p.payment_method,
      amount: p.amount,
      transaction_id: p.transaction_id || "",
      status: p.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* DELETE */
  const deletePayment = async id => {
    if (!confirm("Delete this payment?")) return;

    const res = await fetch(`${API}/Payment/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      alert("🗑 Payment deleted");
      loadPayments();
    } else {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      payment_method: "Cash",
      amount: "",
      transaction_id: "",
      status: "paid",
    });
  };

  return (
    <div className="space-y-8">
      {/* ADD / EDIT */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editId ? "Edit Payment" : "Add Payment"}
          </h3>
          {editId && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <select
            className="border p-2 rounded"
            value={form.payment_method}
            onChange={e =>
              setForm({ ...form, payment_method: e.target.value, transaction_id: "" })
            }
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank</option>
          </select>

          <input
            className="border p-2 rounded"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />

          {showTxn && (
            <input
              className="border p-2 rounded"
              placeholder="Transaction ID"
              value={form.transaction_id}
              onChange={e =>
                setForm({ ...form, transaction_id: e.target.value })
              }
            />
          )}

          <button
            onClick={submit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            {editId ? "Update" : "Add Payment"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Payments History</h3>

        {loading ? (
          "Loading..."
        ) : payments.length === 0 ? (
          "No payments found"
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Transaction</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.payment_method}</td>
                    <td className="p-3">{p.transaction_id || "-"}</td>
                    <td className="p-3 font-medium">₹ {p.amount}</td>
                    <td className="p-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="p-3">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center space-x-3">
                      <button
                        onClick={() => editPayment(p)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePayment(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
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
