import {useEffect} from "react";

import {useNavigate} from "react-router-dom";



function Splash(){


const navigate=useNavigate();



useEffect(()=>{


setTimeout(()=>{

navigate("/role")

},2000)


},[])



return(


<div className="center">


<h1>
🏗 BuildTrack
</h1>


<h3>
Track Today,
Build Tomorrow
</h3>


<div className="loader"></div>


</div>


)


}


export default Splash;