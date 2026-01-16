import React, { useEffect, useState } from "react";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = "https://projects.growtechnologies.in/srisaigroups/";

  /* ---------- LOAD FORMS ---------- */
  useEffect(() => {
    fetch(`${BASE_URL}api/forms/list.php`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setForms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setForms([]);
        setLoading(false);
      });
  }, []);

  /* ---------- MARK FORMS AS VISITED ---------- */
  useEffect(() => {
    // Store the current form IDs as visited
    if (forms.length > 0) {
      const formIds = forms.map(f => f.id).join(',');
      localStorage.setItem('visitedFormIds', formIds);
      localStorage.setItem('lastVisitedFormsTime', Date.now().toString());
      
      // 🔥 Dispatch custom event to notify Sidebar
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { 
        detail: 'visitedFormIds' 
      }));
    }
  }, [forms]);

  if (!user) return <p className="text-red-500">User not logged in</p>;
  if (loading) return <p className="p-6">Loading forms...</p>;
  if (!forms.length) return <p className="p-6">No forms available</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Available Forms</h2>
      
      <div className="space-y-4">
        {forms.map(form => (
          <div
            key={form.id}
            className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {form.title || "Form"}
                  </h4>
                  {form.uploaded_date && (
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded: {new Date(form.uploaded_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <a
                  href={`${BASE_URL}${form.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium transition"
                >
                  View
                </a>
                <a
                  href={`${BASE_URL}${form.file_path}`}
                  download
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}