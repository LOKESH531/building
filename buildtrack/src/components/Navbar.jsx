import {useState,useEffect} from "react";
import {Menu,Bell} from "lucide-react";
import {collection,getDocs} from "firebase/firestore";
import {db} from "../firebase/firebaseConfig";

function Navbar({setOpen}){
  const [showNotif,setShowNotif]=useState(false);
  const [notifications,setNotifications]=useState([]);

  useEffect(()=>{loadNotifications();},[]);

  const loadNotifications=async()=>{
    const notifs=[];
    const [materialSnap,projectSnap]=await Promise.all([
      getDocs(collection(db,"materials")),
      getDocs(collection(db,"projects")),
    ]);

    materialSnap.docs.forEach(d=>{
      const m=d.data();
      if(Number(m.quantity)<10) notifs.push({id:d.id,text:`Low Stock: ${m.name}`,type:"stock"});
    });

    const today=new Date();
    projectSnap.docs.forEach(d=>{
      const p=d.data();
      if(p.endDate&&p.status!=="Completed"){
        const diff=Math.ceil((today-new Date(p.endDate))/(1000*60*60*24));
        if(diff>0) notifs.push({id:d.id,text:`Project Delayed: ${p.name}`,type:"delay"});
      }
      if(p.budget&&p.expenses>p.budget*0.8)
        notifs.push({id:d.id,text:`Budget Warning: ${p.name}`,type:"budget"});
    });

    setNotifications(notifs);
  };

  return(
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={()=>setOpen(prev=>!prev)}>
          <Menu size={22}/>
        </button>
        <h2>🏗 BuildTrack</h2>
      </div>
      <div className="nav-right">
        <div className="notif-wrapper">
          <button className="notif-btn" onClick={()=>setShowNotif(p=>!p)}>
            <Bell size={20}/>
            {notifications.length>0&&(
              <span className="notif-badge">{notifications.length}</span>
            )}
          </button>
          {showNotif&&(
            <div className="notif-dropdown">
              {notifications.length===0?
                <p className="notif-empty">No notifications</p>:
                notifications.map(n=>(
                  <div key={n.id+n.type} className={`notif-item notif-${n.type}`}>
                    {n.text}
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <span className="admin-badge">Admin</span>
      </div>
    </header>
  );
}

export default Navbar;
