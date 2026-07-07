import { useEffect, useState } from "react";
import { Bell, Menu, UserCircle } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./common/LogoutButton";

function Navbar({ setOpen }) {
  const { role, userData } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const parseNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    const cleaned = String(value).replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  };

  const loadNotifications = async () => {
    try {
      const notifs = [];

      const [materialSnap, projectSnap] = await Promise.all([
        getDocs(collection(db, "materials")),
        getDocs(collection(db, "projects")),
      ]);

      materialSnap.docs.forEach((docItem) => {
        const material = docItem.data();
        const qty = parseNumber(
          material.quantity ?? material.qty ?? material.stock
        );

        const name = material.name ?? material.materialName ?? "Material";

        if (qty < 10) {
          notifs.push({
            id: docItem.id,
            text: `Low stock: ${name}`,
            type: "stock",
          });
        }
      });

      const today = new Date();

      projectSnap.docs.forEach((docItem) => {
        const project = docItem.data();

        const name = project.name ?? project.projectName ?? "Project";
        const endDate =
          project.endDate ?? project.end ?? project.dueDate ?? project.deadline;

        const status = String(project.status ?? "").toLowerCase();

        const budget = parseNumber(
          project.budget ?? project.projectBudget ?? project.totalBudget
        );

        const expenses = parseNumber(
          project.expenses ?? project.totalExpenses ?? project.spent
        );

        if (endDate && status !== "completed") {
          const diff = Math.ceil(
            (today - new Date(endDate)) / (1000 * 60 * 60 * 24)
          );

          if (diff > 0) {
            notifs.push({
              id: docItem.id,
              text: `Project delayed: ${name}`,
              type: "delay",
            });
          }
        }

        if (budget > 0 && expenses > budget * 0.8) {
          notifs.push({
            id: docItem.id,
            text: `Budget warning: ${name}`,
            type: "budget",
          });
        }
      });

      setNotifications(notifs.slice(0, 8));
    } catch (error) {
      console.error("Notification load failed:", error);
      setNotifications([]);
    }
  };

  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  const displayName =
    userData?.name || userData?.fullName || userData?.email || roleLabel;

  return (
    <header className="navbar">
      <div className="nav-left">
        <button
          className="menu-btn"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="nav-brand">
          <div className="nav-logo">🏗</div>
          <div>
            <h2>BuildTrack</h2>
            <span>Construction Management System</span>
          </div>
        </div>
      </div>

      <div className="nav-right">
        <div className="notif-wrapper">
          <button
            className="notif-btn"
            onClick={() => setShowNotif((prev) => !prev)}
            aria-label="Notifications"
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <span className="notif-badge">{notifications.length}</span>
            )}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id + notification.type + notification.text}
                    className={`notif-item notif-${notification.type}`}
                  >
                    {notification.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-pill">
          <UserCircle size={22} />
          <div>
            <strong>{displayName}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;
