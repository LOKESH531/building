import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getUsers, deleteUser, updateUser } from "../../services/userService";
import { createUser } from "../../services/authService";
import AddUserModal from "../../components/users/AddUserModal";
import { useAuth } from "../../context/AuthContext";
import UserTable from "../../components/users/UserTable";

function Users() {
  const { userData } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const companyId = userData?.companyId;
    if (!companyId) return;

    try {
      setError("");
      setLoading(true);
      const data = await getUsers(companyId);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load users. Check Firestore rules for the users collection.");
    } finally {
      setLoading(false);
    }
  }, [userData?.companyId]);

  useEffect(() => {
    load();
  }, [load]);

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const remove = async (user) => {
    if (user.role === "owner") {
      alert("Owner account cannot be deleted here.");
      return;
    }

    if (!window.confirm("Delete user profile? This removes the Firestore profile only.")) return;

    try {
      await deleteUser(user.id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Unable to delete user. Check Firestore permission rules.");
    }
  };

  const toggle = async (user) => {
    if (user.role === "owner") {
      alert("Owner account cannot be deactivated here.");
      return;
    }

    try {
      await updateUser(user.id, {
        status: user.status === "active" ? "inactive" : "active",
      });
      await load();
    } catch (err) {
      console.error(err);
      alert("Unable to update user status. Check Firestore permission rules.");
    }
  };

  const saveUser = async (user) => {
    if (!userData?.companyId) {
      alert("Company profile not loaded. Please login again.");
      return;
    }

    if (user.id) {
      await updateUser(user.id, {
        name: user.name.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        role: user.role,
      });
      await load();
      closeModal();
      alert("User updated successfully.");
      return;
    }

    await createUser({ ...user, companyId: userData.companyId });
    await load();
    closeModal();
    alert(`${user.role === "client" ? "Client" : "Admin"} created successfully.`);
  };

  const filtered = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Create Admin and Client accounts for your company.</p>
        </div>
        <button onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div className="toolbar">
        <input
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable
          users={filtered}
          onDelete={remove}
          onToggle={toggle}
          onEdit={(user) => {
            setEditingUser(user);
            setShowModal(true);
          }}
        />
      )}

      <AddUserModal
        open={showModal}
        initialUser={editingUser}
        onClose={closeModal}
        onSave={saveUser}
      />
    </AdminLayout>
  );
}

export default Users;
