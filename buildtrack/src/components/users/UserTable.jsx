function UserTable({ users, onEdit, onDelete, onToggle }) {
  if (!users.length) {
    return <div className="empty-state">No users found.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || "-"}</td>
              <td>{user.email || "-"}</td>
              <td>{user.phone || "-"}</td>
              <td><span className={`role ${user.role}`}>{user.role}</span></td>
              <td><span className={`status-pill ${user.status}`}>{user.status}</span></td>
              <td className="action-buttons">
                <button onClick={() => onEdit(user)}>Edit</button>
                <button onClick={() => onToggle(user)} disabled={user.role === "owner"}>
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button className="danger-btn" onClick={() => onDelete(user)} disabled={user.role === "owner"}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
