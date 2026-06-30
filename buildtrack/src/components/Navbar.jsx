function Navbar({setOpen,logout}){


return(

<nav className="navbar">


<h2>

🏗 BuildTrack

</h2>



<div>


<button

className="menu-btn"

onClick={()=>setOpen(true)}

>

☰

</button>



<button

className="logout-btn"

onClick={logout}

>

Logout

</button>


</div>



</nav>


)

}


export default Navbar;
