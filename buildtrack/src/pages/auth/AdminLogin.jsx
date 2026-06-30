import { useState } from "react";

import { 
signInWithEmailAndPassword 
} from "firebase/auth";


import { auth } from "../../firebase/firebaseConfig";


import { useNavigate } from "react-router-dom";



function AdminLogin(){


const navigate = useNavigate();



const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



const login = async()=>{


try{


const userCredential = await signInWithEmailAndPassword(

auth,

email,

password

);



const user=userCredential.user;



localStorage.setItem(

"admin",

JSON.stringify({

uid:user.uid,

email:user.email

})

);



navigate("/dashboard");



}

catch(error){

alert(error.message);

}



}




return(

<div className="center">


<div className="login-box">


<h1>
Admin Login
</h1>



<input

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>



<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<button

onClick={login}

>

Login

</button>


</div>


</div>

)


}


export default AdminLogin;