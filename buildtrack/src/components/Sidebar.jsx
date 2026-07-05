import {useNavigate} from "react-router-dom";


function Sidebar({open,setOpen}){


const navigate=useNavigate();


return(


<aside

className={open?"sidebar mobile-open":"sidebar"}

>


<button

className="close-btn"

onClick={()=>setOpen(false)}

>

✕

</button>



<h2>

BuildTrack

</h2>



<p onClick={()=>navigate("/dashboard")}>

🏠 Dashboard

</p>


<p onClick={()=>navigate("/projects")}>

🏗 Projects

</p>


<p onClick={()=>navigate("/workers")}>

👷 Workers

</p>


<p onClick={()=>navigate("/materials")}>

📦 Materials

</p>


<p onClick={()=>navigate("/expenses")}>

💰 Expenses

</p>


<p onClick={()=>navigate("/reports")}>

📊 Reports

</p>



</aside>


)


}


export default Sidebar;
