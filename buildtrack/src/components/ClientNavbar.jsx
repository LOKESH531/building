function ClientNavbar(){

const logout=()=>{

localStorage.removeItem("client");

window.location.href="/client-login";

}


return(

<div className="navbar">

<h2>
🏗 BuildTrack
</h2>


<button
className="logout-btn"
onClick={logout}
>

Logout

</button>


</div>

)

}


export default ClientNavbar;
