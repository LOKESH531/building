import {Navigate} from "react-router-dom";


function AdminRoute({children}){


const admin=

localStorage.getItem("admin");



if(!admin){

return <Navigate to="/admin-login"/>

}


return children;


}


export default AdminRoute;
