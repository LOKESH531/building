import {useState} from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/common/LogoutButton";

function AdminLayout({children}){
  const [open,setOpen]=useState(false);

  return(
    <div className="layout">
      <Navbar setOpen={setOpen}/>
      <div className="container">
        <Sidebar open={open}/>
        <div className="content-wrapper">
          <div className="top-actions">
            <LogoutButton/>
          </div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
