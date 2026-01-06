import React, { useEffect, useState } from "react";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function EmployeeFilesView() {
  const [fileGroups, setFileGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState(null);

 const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;

const loadFileGroups = () => {
  if (!userId) {
    setFileGroups([]);
    setLoading(false);
    return;
  }

  setLoading(true);
  fetch(
    `${API}/files/userfile.php?user_id=${userId}&_=${Date.now()}`,
    { cache: "no-store" }
  )
    .then(res => res.json())
    .then(data => {
      setFileGroups(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => {
      setFileGroups([]);
      setLoading(false);
    });
};


  useEffect(() => {
    loadFileGroups();
  }, []);

  const toggleGroup = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Files & Documents</h1>
                <p className="text-gray-500 mt-1">View and download available files</p>
              </div>
            </div>
            <button
              onClick={loadFileGroups}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* FILE GROUPS */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-600"></div>
            <p className="text-gray-500 mt-4">Loading files...</p>
          </div>
        ) : fileGroups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No files available</h3>
            <p className="text-gray-500 mt-2">There are no documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fileGroups.map((group, index) => {
              const isExpanded = expandedGroup === group.group_id;
              const filesByIndex = {};
              if (group.files && group.files.length > 0) {
                group.files.forEach(file => {
                  filesByIndex[file.title_index] = file;
                });
              }

              return (
                <div key={group.group_id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
                  {/* GROUP HEADER */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleGroup(group.group_id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 p-2.5 rounded-lg">
                        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{group.title || `File Group ${index + 1}`}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center text-sm text-gray-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {group.files?.length || 0} files
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {group.created_at ? new Date(group.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`h-6 w-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* EXPANDED CONTENT */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.titles && group.titles.map((title, idx) => {
                          const file = filesByIndex[idx + 1];
                          
                          return (
                            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{title}</h4>
                                  {file ? (
                                    <p className="text-xs text-gray-500 truncate">{file.file_name}</p>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic">No file uploaded</p>
                                  )}
                                </div>
                                <div className={`flex-shrink-0 ml-2 p-2 rounded-lg ${file ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  {file ? (
                                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              </div>

                              {file ? (
                                <div className="flex gap-2">
                                  <a
                                    href={`${API.replace("/api", "")}/${file.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View
                                  </a>
                                  <a
                                    href={`${API.replace("/api", "")}/${file.file_path}`}
                                    download
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                  </a>
                                </div>
                              ) : (
                                <div className="text-center py-2">
                                  <span className="text-xs text-gray-400">No data available</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}