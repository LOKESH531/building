import ClientNavbar from "../components/ClientNavbar";
import LogoutButton from "../components/common/LogoutButton";


function ClientLayout({children}){


return(

<div>
<ClientNavbar/>
<div style={{display:"flex",justifyContent:"flex-end",padding:"10px 20px"}}>
<LogoutButton/>
</div>
{children}
</div>


)

}


export default ClientLayout;
