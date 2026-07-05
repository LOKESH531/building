import {useNavigate} from "react-router-dom";

function Sidebar({open}){
  const navigate=useNavigate();
  return(
    <aside className={open?"sidebar mobile-open":"sidebar"}>
      <h2>BuildTrack</h2>
      <div className="sidebar-links">
        <p onClick={()=>navigate("/dashboard")}>🏠 Dashboard</p>
        <p onClick={()=>navigate("/projects")}>🏗 Projects</p>
        <p onClick={()=>navigate("/workers")}>👷 Workers</p>
        <p onClick={()=>navigate("/materials")}>📦 Materials</p>
        <p onClick={()=>navigate("/expenses")}>💰 Expenses</p>
        <p onClick={()=>navigate("/reports")}>📊 Reports</p>
      </div>
    </aside>
  )
}

export default Sidebar;
