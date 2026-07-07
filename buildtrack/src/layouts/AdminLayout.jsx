import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout">
      <Navbar setOpen={setOpen} />

      <div className="container">
        <Sidebar open={open} setOpen={setOpen} />

        {open && (
          <button
            className="sidebar-backdrop"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
        )}

        <main className="content-wrapper">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
