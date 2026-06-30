import {Navigate} from "react-router-dom";


function ProtectedRoute({children,type}){


const admin = localStorage.getItem("admin");

const client = localStorage.getItem("client");



if(type==="admin" && !admin){

return <Navigate to="/admin-login"/>;

}



if(type==="client" && !client){

return <Navigate to="/client-login"/>;

}



return children;


}


export default ProtectedRoute;