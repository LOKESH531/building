import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Package,
  IndianRupee,
  BarChart3,
  UserCog,
} from "lucide-react";

function Sidebar({ open, setOpen }) {
  const { role } = useAuth();

  const closeMenu = () => {
    if (setOpen) setOpen(false);
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Workers", path: "/workers", icon: Users },
    { label: "Materials", path: "/materials", icon: Package },
    { label: "Expenses", path: "/expenses", icon: IndianRupee },
    { label: "Reports", path: "/reports", icon: BarChart3 },
  ];

  if (role === "owner") {
    menuItems.push({
      label: "User Management",
      path: "/users",
      icon: UserCog,
    });
  }

  return (
    <aside className={open ? "sidebar mobile-open" : "sidebar"}>
      <div className="sidebar-brand">
        <div className="brand-logo">BT</div>
        <div>
          <h2>BuildTrack</h2>
          <p>Construction System</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
