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


<Navbar

setOpen={setOpen}

open={open}

logout={logout}

/>



<div className="container">


<Sidebar

open={open}

setOpen={setOpen}

/>



<main>

{children}

</main>


</div>


</div>

)

}


export default AdminLayout;
