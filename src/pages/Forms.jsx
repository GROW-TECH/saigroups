import React, { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Forms() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [form, setForm] = useState({
    request_type: "Withdrawal",
    description: ""
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        fetchMyRequests(userData.id);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }, []);

  const fetchMyRequests = async (userId) => {
    setLoadingRequests(true);
    try {
      const res = await fetch(`https://projects.growtechnologies.in/srisaigroups/api/epfo/my-requests.php?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const submit = async () => {
    if (!user?.id) {
      alert("User not logged in");
      return;
    }

    if (!form.description.trim()) {
      alert("Please provide a description");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/epfo/create.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: user.id,
            request_type: form.request_type,
            description: form.description
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setForm({ request_type: "Withdrawal", description: "" });
        
        // Refresh the requests list
        fetchMyRequests(user.id);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Submit Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">EPFO Request</h3>
          <p className="text-sm text-gray-500 mt-1">
            Submit your EPFO request for processing
          </p>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-green-700 font-medium">
                EPFO request submitted successfully!
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={form.request_type}
              onChange={e => setForm({ ...form, request_type: e.target.value })}
              disabled={loading}
            >
              <option value="Withdrawal">Withdrawal</option>
              <option value="Transfer">Transfer</option>
              <option value="Correction">Correction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Please provide details about your request..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              disabled={loading}
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.description.length} characters
            </p>
          </div>

          <button 
            onClick={submit} 
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            } text-white`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </div>

      {/* My Requests Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">My EPFO Requests</h3>
            <p className="text-sm text-gray-500 mt-1">
              View your submitted EPFO requests
            </p>
          </div>
         
        </div>

        {loadingRequests ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No requests yet</p>
            <p className="text-gray-500 text-sm mt-1">Your submitted EPFO requests will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{request.request_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {request.description.length > 60 
                        ? request.description.substring(0, 60) + '...' 
                        : request.description}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{request.created_at}</td>
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