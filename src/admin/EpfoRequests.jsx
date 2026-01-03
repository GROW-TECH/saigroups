import React, { useEffect, useState } from "react";

const API =
  "https://projects.growtechnologies.in/srisaigroups/api/admin/epfo_requests";

export default function AdminEpfoRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD REQUESTS ================= */
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/list.php`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load EPFO requests");
      }

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load EPFO requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /* ================= DATE FORMAT ================= */
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        EPFO Requests (Admin)
      </h1>

      {/* ERROR */}
      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Request Type</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {r.employee_name || "-"}
                  </td>

                  <td className="p-3">
                    {r.request_type}
                  </td>

                  <td className="p-3">
                    {r.description}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {formatDate(r.created_at)}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No EPFO requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
