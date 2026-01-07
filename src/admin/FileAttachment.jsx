import React, { useEffect, useState } from "react";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

/* ---------- FILE TO BASE64 ---------- */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminFileAttachment() {
  const [fileGroups, setFileGroups] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    file_date: "",
    main_title: "",
    entries: [
      { title: "", file: null }
    ]
  });

  /* ---------- LOAD EMPLOYERS ---------- */
  const loadEmployers = () => {
    fetch(`${API}/employers/list.php?_=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Employers loaded:", data);
        setEmployers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading employers:", err);
        setEmployers([]);
      });
  };

  /* ---------- LOAD FILE GROUPS ---------- */
  const loadFileGroups = () => {
    setLoading(true);
    fetch(`${API}/files/list.php?_=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setFileGroups(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading file groups:", err);
        setFileGroups([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEmployers();
    loadFileGroups();
  }, []);

  /* ---------- ADD NEW ENTRY ROW ---------- */
  const addEntry = () => {
    if (form.entries.length >= 5) {
      alert("Maximum 5 entries allowed");
      return;
    }
    setForm({
      ...form,
      entries: [...form.entries, { title: "", file: null }]
    });
  };

  /* ---------- REMOVE ENTRY ROW ---------- */
  const removeEntry = (index) => {
    const newEntries = form.entries.filter((_, i) => i !== index);
    setForm({ ...form, entries: newEntries });
  };

  /* ---------- UPDATE ENTRY TITLE ---------- */
  const updateEntryTitle = (index, title) => {
    const newEntries = [...form.entries];
    newEntries[index].title = title;
    setForm({ ...form, entries: newEntries });
  };

  /* ---------- UPDATE ENTRY FILE ---------- */
  const updateEntryFile = (index, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      alert("File must be under 10 MB");
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx'];
    if (!allowed.includes(ext)) {
      alert("Invalid file type");
      return;
    }

    const newEntries = [...form.entries];
    newEntries[index].file = file;
    setForm({ ...form, entries: newEntries });
  };

  /* ---------- CREATE FILE GROUP ---------- */
  const createFileGroup = async () => {
    // Validate user selection
    if (!form.user_id) {
      alert("Please select an employer");
      return;
    }

    // Validate date selection
    if (!form.file_date) {
      alert("Please select a date");
      return;
    }

    // Validate main title
    if (!form.main_title.trim()) {
      alert("Please enter a main title");
      return;
    }

    // Validate all entries have title and file
    for (let i = 0; i < form.entries.length; i++) {
      if (!form.entries[i].title) {
        alert(`Title is required for entry ${i + 1}`);
        return;
      }
      if (!form.entries[i].file) {
        alert(`File is required for entry ${i + 1}`);
        return;
      }
    }

    // Convert all files to base64
    const filesData = await Promise.all(
      form.entries.map(async (entry) => ({
        name: entry.file.name,
        base64: await fileToBase64(entry.file),
      }))
    );

    const titles = form.entries.map(entry => entry.title);

    let payload = {
      user_id: form.user_id,
      file_date: form.file_date,
      main_title: form.main_title,
      titles: titles,
      files: filesData,
    };

    fetch(`${API}/files/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Files uploaded successfully!");
          setOpen(false);
          setForm({ user_id: "", file_date: "", main_title: "", entries: [{ title: "", file: null }] });
          loadFileGroups();
        } else {
          alert(data.error || "Error uploading files");
        }
      })
      .catch((err) => {
        alert("Error creating file group");
        console.error(err);
      });
  };

  /* ---------- DELETE FILE GROUP ---------- */
  const deleteFileGroup = (groupId) => {
    if (!confirm("Are you sure you want to delete this file group and all its files?")) return;

    fetch(`${API}/files/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_id: groupId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("File group deleted successfully!");
          loadFileGroups();
        } else {
          alert(data.error || "Error deleting file group");
        }
      })
      .catch((err) => {
        alert("Error deleting file group");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">File Attachments</h1>
            <p className="text-gray-500 mt-1">Upload multiple files with separate titles (up to 5 per group)</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all"
          >
            + Add New Attachments
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-orange-600"></div>
              <p className="text-gray-500 mt-4">Loading file attachments...</p>
            </div>
          ) : fileGroups.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No file attachments found</h3>
              <p className="text-gray-500 mt-2">Get started by uploading your first file group</p>
              <button
                onClick={() => setOpen(true)}
                className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Upload Files
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Main Title
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Employer Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Month/Year
                    </th>
                    {/* Dynamic columns based on first group's titles */}
                    {fileGroups.length > 0 && fileGroups[0].titles && fileGroups[0].titles.map((title, idx) => (
                      <th key={idx} className="px-4 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                        {title}
                      </th>
                    ))}
                    <th className="px-4 py-4 text-center text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {fileGroups.map((group, index) => {
                    // Create a map of files by title_index (1-based)
                    const filesByIndex = {};
                    if (group.files && group.files.length > 0) {
                      group.files.forEach(file => {
                        filesByIndex[file.title_index] = file;
                      });
                    }

                    // Get titles array
                    const titles = group.titles || [];
                    const maxColumns = fileGroups[0]?.titles?.length || 5;

                    return (
                      <tr key={group.group_id} className="hover:bg-orange-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {group.main_title || '-'}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {group.user_name || '-'}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                          {group.file_date || '-'}
                        </td>

                        {/* Dynamic columns for files */}
                        {Array.from({ length: maxColumns }, (_, i) => i + 1).map(colIndex => (
                          <td key={colIndex} className="px-4 py-4">
                            {filesByIndex[colIndex] ? (
                              <a
                                href={`${API.replace("/api", "")}/${filesByIndex[colIndex].file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate max-w-[150px]">{filesByIndex[colIndex].file_name}</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">No file</span>
                            )}
                          </td>
                        ))}

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => deleteFileGroup(group.group_id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-all"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <h4 className="font-semibold text-xl text-white">Add New File Attachments</h4>
              <p className="text-orange-100 text-sm mt-1">Add up to 5 files with individual titles</p>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* EMPLOYER SELECTION */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Employer *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                >
                  <option value="">-- Choose an employer --</option>
                  {employers.map((emp) => (
                    <option key={emp.user_id} value={emp.user_id}>
                      {emp.user_name} - {emp.organization_name} {emp.organization_code ? `(${emp.organization_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE SELECTION */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={form.file_date}
                  onChange={(e) => setForm({ ...form, file_date: e.target.value })}
                />
              </div>

              {/* MAIN TITLE */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Title *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Monthly Compliance Documents"
                  value={form.main_title}
                  onChange={(e) => setForm({ ...form, main_title: e.target.value })}
                />
              </div>

              {/* FILE ENTRIES */}
              {form.entries.map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-semibold text-gray-700">Entry {index + 1}</h5>
                    {form.entries.length > 1 && (
                      <button
                        onClick={() => removeEntry(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., EPFO Challan"
                        value={entry.title}
                        onChange={(e) => updateEntryTitle(index, e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id={`file-${index}`}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                          onChange={(e) => updateEntryFile(index, e.target.files[0])}
                        />
                        <label
                          htmlFor={`file-${index}`}
                          className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-orange-400 transition-all"
                        >
                          {entry.file ? (
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700 truncate max-w-[200px]">{entry.file.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Choose File
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {form.entries.length < 5 && (
                <button
                  onClick={addEntry}
                  className="w-full border-2 border-dashed border-orange-300 rounded-lg px-4 py-3 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another Entry ({form.entries.length}/5)
                </button>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setOpen(false);
                  setForm({ user_id: "", file_date: "", main_title: "", entries: [{ title: "", file: null }] });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createFileGroup}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-lg transition-all"
              >
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}