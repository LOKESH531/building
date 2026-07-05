import {useEffect,useState} from "react";


import {

collection,

getDocs,

addDoc

}

from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";


import {

useParams

}

from "react-router-dom";


import AdminLayout from "../../layouts/AdminLayout";



function AssignWorkers(){


const {id}=useParams();


const [workers,setWorkers]=useState([]);


const [selected,setSelected]=useState("");



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




const assign=async()=>{


const worker=

workers.find(

w=>w.id===selected

);



await addDoc(

collection(db,"projectWorkers"),

{

projectId:id,

workerId:worker.id,

workerName:worker.name,

role:worker.role

}

);



alert("Worker Assigned");


};




return(


<AdminLayout>



<div className="form-box">


<h1>

Assign Worker

</h1>



<select

onChange={e=>setSelected(e.target.value)}

>


<option>

Select Worker

</option>



{

workers.map(w=>(


<option

value={w.id}

key={w.id}

>

{w.name}

-

{w.role}

</option>


))


}


</select>



<button

className="add-btn"

onClick={assign}

>

Assign

</button>



</div>


</AdminLayout>


)


}


export default AssignWorkers;
