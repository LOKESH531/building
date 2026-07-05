import {useNavigate} from "react-router-dom";


function RoleSelect(){


const navigate=useNavigate();



return(

<div className="center">


<h1>
Choose Account
</h1>



<button

onClick={()=>navigate("/login")}

>

🏢 Business Admin

</button>



<button

onClick={()=>navigate("/login")}

>

👤 Client

</button>



</div>

)

}


export default RoleSelect;