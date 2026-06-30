import {useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";


import {
addDoc,
collection
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";


import {useParams,useNavigate} from "react-router-dom";



function DailyUpdate(){


const {id}=useParams();

const navigate=useNavigate();



const [workers,setWorkers]=useState("");

const [completed,setCompleted]=useState("");

const [pending,setPending]=useState("");




const saveUpdate=async()=>{


await addDoc(

collection(db,"dailyUpdates"),

{

projectId:id,

date:new Date().toLocaleDateString(),

workers:Number(workers),

completed:completed,

pending:pending,

createdAt:new Date()

}

);



alert("Daily Update Added");


navigate(`/project/${id}`);


};






return(


<AdminLayout>


<h1>

Daily Work Update

</h1>




<div className="form-box">


<label>

Workers

</label>


<input

type="number"

value={workers}

onChange={(e)=>setWorkers(e.target.value)}

placeholder="Number of workers"

/>





<label>

Completed Work

</label>


<input

value={completed}

onChange={(e)=>setCompleted(e.target.value)}

placeholder="Example: Brick work completed"

/>





<label>

Pending Work

</label>


<input

value={pending}

onChange={(e)=>setPending(e.target.value)}

placeholder="Example: Painting pending"

/>





<button

className="add-btn"

onClick={saveUpdate}

>

Save Update

</button>



</div>



</AdminLayout>


)


}


export default DailyUpdate;