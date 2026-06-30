import {useState} from "react";

import {useNavigate} from "react-router-dom";

import {
collection,
query,
where,
getDocs
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function ClientLogin(){


const navigate=useNavigate();


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");




const login=async()=>{


try{


const q=query(


collection(db,"clients"),


where("email","==",email),


where("password","==",password)


);




const snap=await getDocs(q);




if(snap.empty){


alert("Invalid Login");

return;


}





const client=snap.docs[0];



const clientData={

id:client.id,

...client.data()

};



localStorage.setItem(

"client",

JSON.stringify(clientData)

);




alert("Login Successful");



navigate("/client-dashboard");



}

catch(error){


console.log(error);

alert("Login Error");


}



};






return(


<div className="center">


<div className="login-box">


<h1>

Client Login

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

className="add-btn"

onClick={login}

>

Login

</button>



</div>


</div>


)


}



export default ClientLogin;
