import React, { useEffect, useState } from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    fetch(
      `https://projects.growtechnologies.in/srisaigroups/api/users/get-profile.php?user_id=${user.id}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm(data);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/users/update-profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, ...form }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      setProfile(data);
      setShowEdit(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card p-6">Loading profile...</div>;
  if (error) return <div className="card p-6 bg-red-50 text-red-600">{error}</div>;

  return (
    <>
      {success && (
        <div className="card p-4 mb-4 bg-green-50 text-green-700">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* PROFILE */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <button className="btn-secondary" onClick={() => setShowEdit(true)}>
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <Info label="Name" value={profile.name} />
            <Info label="Email" value={profile.email} />
            <Info label="Phone" value={profile.phone} />
            <Info label="Password" value={profile.password} />

            {profile.employee_code && (
              <>
                <Info label="Employee Code" value={profile.employee_code} />
                <Info label="Department" value={profile.department} />
                <Info label="Designation" value={profile.designation} />
              </>
            )}
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
            className="bg-white rounded-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <span className="badge bg-brand-100 text-brand-700 capitalize">
                {profile.user_type}
              </span>
            </div>

           <div className="space-y-3">
  <Input
    label="Name"
    value={form.name}
    onChange={(v) => setForm({ ...form, name: v })}
  />

  <Input
    label="Phone"
    value={form.phone}
    onChange={(v) => setForm({ ...form, phone: v })}
  />

  <Input
    label="Email"
    value={form.email}
    onChange={(v) => setForm({ ...form, email: v })}
  />
 <Input
    label="Password"
    value={form.password}
    onChange={(v) => setForm({ ...form, password: v })}
  />

  <p className="text-xs text-gray-500">
    Changing email will affect login credentials
  </p>

  {form.employee_code && (
    <>
      <Input
        label="Department"
        value={form.department}
        onChange={(v) => setForm({ ...form, department: v })}
      />
      <Input
        label="Designation"
        value={form.designation}
        onChange={(v) => setForm({ ...form, designation: v })}
      />
    </>
  )}
</div>


            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn-secondary"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button
  className="btn-primary"
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

/* ---------- Helpers ---------- */
const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const Input = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="label">{label}</label>
    <input
      className={`input ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
);
