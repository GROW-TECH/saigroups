import React, { useEffect, useState } from "react";
import Table from "../components/Table.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function EpfoRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("https://projects.growtechnologies.in/srisaigroups/api/epfo/list.php")
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch requests');
        return res.json();
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const updateStatus = async (requestId, newStatus) => {
    const confirmMessage = `Are you sure you want to ${newStatus} this request?`;
    if (!confirm(confirmMessage)) return;

    setActionLoading(prev => ({ ...prev, [requestId]: true }));

    const payload = {
      request_id: parseInt(requestId),
      status: newStatus
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/epfo/update-status.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const result = await res.json();
      console.log("Response:", result);

      if (result.success) {
        alert(`Request ${newStatus} successfully!`);
        fetchData(); // Refresh the list
      } else {
        alert(result.message || `Failed to ${newStatus} request`);
        console.error("Error details:", result);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update request status. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const columns = [
    { key: "id", title: "Request ID" },
    { key: "employee_code", title: "Employee Code" },
    { key: "employee_name", title: "Employee Name" },
    { key: "department", title: "Department" },
    { key: "request_type", title: "Type" },
    {
      key: "status",
      title: "Status",
      render: v => <StatusBadge status={v} />
    },
    { key: "created_at", title: "Date" },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'submitted' && (
            <>
              <button
                onClick={() => updateStatus(row.id, 'completed')}
                disabled={actionLoading[row.id]}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading[row.id] ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => updateStatus(row.id, 'rejected')}
                disabled={actionLoading[row.id]}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading[row.id] ? 'Processing...' : 'Reject'}
              </button>
            </>
          )}
          {row.status === 'completed' && (
            <span className="text-green-600 text-sm font-medium">✓ Approved</span>
          )}
          {row.status === 'rejected' && (
            <span className="text-red-600 text-sm font-medium">✗ Rejected</span>
          )}
          {row.status === 'processing' && (
            <span className="text-yellow-600 text-sm font-medium">⏳ Processing</span>
          )}
        </div>
      )
    }
  ];

  // Filter data based on selected filter
  const filteredData = filter === "all" 
    ? data 
    : data.filter(item => item.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          <div>
            <h4 className="text-red-800 font-medium">Error loading requests</h4>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">EPFO Requests</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filteredData.length} {filteredData.length === 1 ? 'request' : 'requests'} found
          </p>
        </div>
        
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 border-b border-gray-200">
        {['all', 'submitted', 'processing', 'completed', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === status
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {status === 'completed' ? 'Approved' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                {data.filter(item => item.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-gray-700 font-medium mb-2">No requests found</h4>
          <p className="text-gray-500 text-sm">
            {filter === 'all' 
              ? 'No EPFO requests have been submitted yet.' 
              : `No ${filter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table columns={columns} data={filteredData} />
        </div>
      )}
    </div>
  );
}
