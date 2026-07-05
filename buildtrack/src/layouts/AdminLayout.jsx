import {useState} from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AdminLayout({children}){
  const [open,setOpen]=useState(false);

  const logout=()=>{
    localStorage.removeItem("admin");
    window.location.href="/admin-login";
  };

  return(
    <div className="layout">
      <Navbar setOpen={setOpen}/>
      <div className="container">
        <Sidebar open={open}/>
        <div className="content-wrapper">
          <div className="top-actions">
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout;
