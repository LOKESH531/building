import {useEffect,useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";


import {
collection,
addDoc,
getDocs
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function Workers(){


const [workers,setWorkers]=useState([]);


const [name,setName]=useState("");

const [role,setRole]=useState("");

const [phone,setPhone]=useState("");



useEffect(()=>{

loadWorkers();

},[]);




const loadWorkers=async()=>{


const data=await getDocs(

collection(db,"workers")

);



setWorkers(

data.docs.map(doc=>(

{

id:doc.id,

...doc.data()

}

))

);


};




const addWorker=async()=>{


if(!name || !role){


alert("Fill details");

return;


}



await addDoc(

collection(db,"workers"),

{

name:name,

role:role,

phone:phone,

createdAt:new Date()

}

);



alert("Worker Added");


setName("");

setRole("");

setPhone("");


loadWorkers();


};




return(


<AdminLayout>


<h1>

Workers

</h1>



<div className="form-box">


<input

placeholder="Worker Name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>



<input

placeholder="Role (Mason, Electrician)"

value={role}

onChange={(e)=>setRole(e.target.value)}

/>



<input

placeholder="Phone"

value={phone}

onChange={(e)=>setPhone(e.target.value)}

/>



<button

className="add-btn"

onClick={addWorker}

>

Add Worker

</button>



</div>




<div className="dashboard-box">


<h2>

Worker List

</h2>



{

workers.map(worker=>(


<div key={worker.id}>


<p>

👷 {worker.name}

</p>


<p>

Role:
{worker.role}

</p>


<p>

Phone:
{worker.phone}

</p>


<hr/>


</div>


))


}



</div>


</AdminLayout>


)


}


export default Workers;
