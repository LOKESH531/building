import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "admin",
  password: "",
  confirmPassword: "",
};

function AddUserModal({ open, onClose, onSave, initialUser = null }) {
  const isEdit = Boolean(initialUser?.id);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const title = useMemo(() => (isEdit ? "Edit User" : "Add User"), [isEdit]);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      return;
    }

    if (initialUser) {
      setForm({
        name: initialUser.name || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        role: initialUser.role || "admin",
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, initialUser]);

  if (!open) return null;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Please fill name and email");
      return;
    }

    if (!isEdit && !form.password) {
      alert("Please enter temporary password");
      return;
    }

    if (!isEdit && form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (!isEdit && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      await onSave({ ...form, id: initialUser?.id });
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>

        <label className="field-label">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={change}
          disabled={initialUser?.role === "owner"}
        >
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          {initialUser?.role === "owner" && <option value="owner">Owner</option>}
        </select>

        <input name="name" placeholder="Full Name *" value={form.name} onChange={change} />
        <input name="email" type="email" placeholder="Email *" value={form.email} onChange={change} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={change} />

        {!isEdit && (
          <>
            <input
              name="password"
              type="password"
              placeholder="Temporary Password *"
              value={form.password}
              onChange={change}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password *"
              value={form.confirmPassword}
              onChange={change}
            />
          </>
        )}

        {isEdit && (
          <p className="modal-note">
            Email/password authentication changes must be handled from Firebase Authentication.
            This edit updates the user profile used by the app.
          </p>
        )}

        <div className="modal-buttons">
          <button onClick={submit} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
          </button>
          <button onClick={onClose} disabled={saving}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;
