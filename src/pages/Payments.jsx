import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function Payments() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    payment_method: "Cash",
    amount: "",
    transaction_id: "",
    status: "paid"
  });

  const showTxn = form.payment_method !== "Cash";

  /* LOAD PAYMENTS */
  const loadPayments = () => {
    setLoading(true);
    fetch(`${API}/Payment/list.php`)
      .then(r => r.json())
      .then(res => res.success && setPayments(res.data || []))
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
        ...form,
        id: editId,
        transaction_id: showTxn ? form.transaction_id : null,
        employer_id: user.id,
        created_by: user.id,
        created_role: user.role
      })
    });

    const data = await res.json();
    if (data.success) {
      resetForm();
      loadPayments();
    } else {
      alert(data.message || "Operation failed");
    }
  };

  /* EDIT */
  const editPayment = p => {
    setEditId(p.id);
    setForm({
      payment_method: p.payment_method,
      amount: p.amount,
      transaction_id: p.transaction_id || "",
      status: p.status || "paid"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* DELETE */
  const deletePayment = async id => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    const res = await fetch(`${API}/Payment/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    if (data.success) loadPayments();
    else alert("Delete failed");
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      payment_method: "Cash",
      amount: "",
      transaction_id: "",
      status: "paid"
    });
  };

  return (
    <div className="space-y-8">
      {/* ADD / EDIT CARD */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold">
            {editId ? "Edit Payment" : "Add Payment"}
          </h3>
          {editId && (
            <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Editing Mode
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600">Payment Method</label>
            <select
              className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.payment_method}
              onChange={e =>
                setForm({
                  ...form,
                  payment_method: e.target.value,
                  transaction_id: ""
                })
              }
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Amount</label>
            <input
              className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="₹ Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          {showTxn && (
            <div>
              <label className="text-sm text-gray-600">Transaction ID</label>
              <input
                className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Transaction reference"
                value={form.transaction_id}
                onChange={e =>
                  setForm({ ...form, transaction_id: e.target.value })
                }
              />
            </div>
          )}

          <button
            onClick={submit}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-2 font-medium"
          >
            {editId ? "Update Payment" : "Add Payment"}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="border rounded-lg px-6 py-2 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Payments History</h3>

        {loading ? (
          <div className="text-gray-500 py-6">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-gray-500 py-6">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Transaction</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{p.id}</td>
                    <td className="p-3">{p.payment_method}</td>
                    <td className="p-3">{p.transaction_id || "-"}</td>
                    <td className="p-3 font-semibold">₹ {p.amount}</td>
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
