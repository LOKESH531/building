import {useState} from "react";

import {
addDoc,
collection
}
from "firebase/firestore";

import {db} from "../../firebase/firebaseConfig";

import {useParams} from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";



function DailyUpdate(){


const {id}=useParams();


const [work,setWork]=useState("");

const [workers,setWorkers]=useState("");

const [problem,setProblem]=useState("");




const save=async()=>{


await addDoc(

collection(db,"dailyUpdates"),

{

projectId:id,

date:new Date().toLocaleDateString(),

workDone:work,

workers:workers,

problems:problem

}

);



alert("Update Added");


};




return(

<AdminLayout>


<div className="form-box">


<h1>

Daily Update

</h1>



<input

placeholder="Work Done"

onChange={e=>setWork(e.target.value)}

/>



<input

placeholder="Workers Count"

onChange={e=>setWorkers(e.target.value)}

/>



<input

placeholder="Problems"

onChange={e=>setProblem(e.target.value)}

/>



<button

className="add-btn"

onClick={save}

>

Add Update

</button>



</div>



</AdminLayout>


)

}


export default DailyUpdate;
