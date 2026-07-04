import {Navigate} from "react-router-dom";


function ClientRoute({children}){


const client=

localStorage.getItem("client");



if(!client){

return <Navigate to="/client-login"/>

}



return children;


}


export default ClientRoute;
