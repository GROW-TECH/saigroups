"use client";

import React, { useEffect, useState } from "react";

export default function AdminProfile() {
  /* ---------- GET ADMIN FROM LOCALSTORAGE ---------- */
  const admin =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("admin"))
      : null;

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  /* ---------- IF ADMIN NOT LOGGED IN ---------- */
  if (!admin) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-600">
        Admin not logged in
      </div>
    );
  }

  /* ---------- LOAD ADMIN PROFILE ---------- */
  useEffect(() => {
    if (!admin?.id) return;

    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/admin/get-profile.php?admin_id=${admin.id}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data?.name || "",
          email: data?.email || "",
          password: data?.password || "",
        });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [admin?.id]);

  /* ---------- SAVE ADMIN PROFILE ---------- */
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/admin/update-profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            admin_id: admin.id,
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setProfile({
        ...profile,
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setShowEdit(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <>
      {success && (
        <div className="bg-green-50 border border-green-200 p-4 mb-4 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-orange-200 rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-orange-600">
              Profile Information
            </h3>
            <button
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
              onClick={() => setShowEdit(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <Info label="Name" value={profile?.name} />
            <Info label="Email" value={profile?.email} />
            <Info label="Password" value={profile?.password} />
            <Info label="Role" value="Admin" />
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEdit && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowEdit(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg p-6 border border-orange-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-orange-600">
                Edit Profile
              </h3>
              <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                admin
              </span>
            </div>

            <div className="space-y-3">
              <Input
                label="Name"
                value={form.name}
                onChange={(v) =>
                  setForm({ ...form, name: v })
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(v) =>
                  setForm({ ...form, email: v })
                }
              />

              <Input
                label="Password"
                value={form.password}
                onChange={(v) =>
                  setForm({ ...form, password: v })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition disabled:opacity-50"
                onClick={handleSave}
                disabled={saving || !form.name || !form.email}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- HELPERS ---------- */
const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">
      {value !== undefined && value !== null && value !== "" ? value : "-"}
    </p>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">
      {label}
    </label>
    <input
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);