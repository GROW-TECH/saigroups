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

export default function AdminForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    upload_file: null,
  });

  /* ---------- LOAD FORMS ---------- */
  const loadForms = () => {
    setLoading(true);
    fetch(`${API}/forms/list.php?_=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setForms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setForms([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadForms();
  }, []);

  /* ---------- CREATE FORM ---------- */
  const createForm = async () => {
    if (!form.title || !form.upload_file) {
      alert("Title and file are required");
      return;
    }

    let payload = {
      title: form.title,
      file_name: form.upload_file.name,
      file_base64: await fileToBase64(form.upload_file),
    };

    fetch(`${API}/forms/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Form uploaded successfully!");
          setOpen(false);
          setForm({ title: "", upload_file: null });
          loadForms();
        } else {
          alert(data.error || "Error uploading form");
        }
      })
      .catch((err) => {
        alert("Error creating form");
        console.error(err);
      });
  };

  /* ---------- DELETE FORM ---------- */
  const deleteForm = (formId) => {
    if (!confirm("Are you sure you want to delete this form?")) return;

    fetch(`${API}/forms/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form_id: formId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Form deleted successfully!");
          loadForms();
        } else {
          alert(data.error || "Error deleting form");
        }
      })
      .catch((err) => {
        alert("Error deleting form");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Forms Management</h1>
            <p className="text-gray-500 mt-1">Upload and manage your forms</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all"
          >
            + Add New Form
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-orange-600"></div>
              <p className="text-gray-500 mt-4">Loading forms...</p>
            </div>
          ) : forms.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No forms found</h3>
              <p className="text-gray-500 mt-2">Get started by uploading your first form</p>
              <button
                onClick={() => setOpen(true)}
                className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Upload Form
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Form Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-orange-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {forms.map((f, index) => (
                    <tr key={f.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-medium text-gray-900">{f.title}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {f.uploaded_date}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          {f.file_path ? (
                            <>
                              <a
                                href={`${API.replace("/api", "")}/${f.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition-all"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </a>
                              <a
                                href={`${API.replace("/api", "")}/${f.file_path}`}
                                download
                                className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-all"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </a>
                              <button
                                onClick={() => deleteForm(f.id)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-all"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">No file</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <h4 className="font-semibold text-xl text-white">Add New Form</h4>
              <p className="text-orange-100 text-sm mt-1">Upload a new form document</p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter form title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-all">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.size > 10 * 1024 * 1024) {
                        alert("File must be under 10 MB");
                        return;
                      }

                      setForm({ ...form, upload_file: file });
                    }}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold text-orange-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                  </label>
                </div>
                {form.upload_file && (
                  <div className="mt-3 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700 font-medium">{form.upload_file.name}</span>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, upload_file: null })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setForm({ title: "", upload_file: null });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createForm}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-lg transition-all"
              >
                Upload Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}