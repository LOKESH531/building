import {useNavigate} from "react-router-dom";


function RoleSelect(){


const navigate=useNavigate();



return(

<div className="center">


<h1>
Choose Account
</h1>



<button

onClick={()=>navigate("/admin-login")}

>

🏢 Business Admin

</button>



<button

onClick={()=>navigate("/client-login")}

>

👤 Client

</button>



</div>

)

}


export default RoleSelect;