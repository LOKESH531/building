import ClientNavbar from "../components/ClientNavbar";


function ClientLayout({children}){


return(

<div>

<ClientNavbar/>

{children}

</div>


)

}


export default ClientLayout;
