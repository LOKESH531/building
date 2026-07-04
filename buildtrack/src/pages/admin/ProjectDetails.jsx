import {useEffect,useState} from "react";

import {useParams,useNavigate} from "react-router-dom";

import {
doc,
getDoc,
collection,
getDocs,
deleteDoc
}
from "firebase/firestore";

import {db} from "../../firebase/firebaseConfig";

import AdminLayout from "../../layouts/AdminLayout";

import generateReport from "../../utils/generateReport";


function ProjectDetails(){


const {id}=useParams();

const navigate=useNavigate();


const [project,setProject]=useState(null);

const [materialTotal,setMaterialTotal]=useState(0);

const [expenseTotal,setExpenseTotal]=useState(0);

const [assignedWorkers,setAssignedWorkers]=useState([]);

const [spent,setSpent]=useState(0);


useEffect(()=>{

loadProject();

loadMaterials();

loadExpenses();

loadWorkers();

calculateSpent();

},[]);


const calculateSpent=async()=>{

const data=await getDocs(

collection(db,"expenses")

);

let total=0;

data.docs.forEach(doc=>{

const e=doc.data();

if(e.projectId===id){

total+=Number(e.amount);

}

});

setSpent(total);

};


const loadWorkers=async()=>{

const data=await getDocs(

collection(db,"projectWorkers")

);

setAssignedWorkers(

data.docs.map(doc=>doc.data())

.filter(w=>w.projectId===id)

);

};


const loadProject=async()=>{

const snap=await getDoc(

doc(db,"projects",id)

);

if(snap.exists()){

setProject({

id:snap.id,

...snap.data()

});

}

};


const loadMaterials=async()=>{

const data=await getDocs(

collection(db,"materials")

);

let total=0;

data.docs.forEach(doc=>{

const item=doc.data();

if(item.projectId===id){

total += Number(item.cost || item.amount || 0);

}

});

setMaterialTotal(total);

};


const downloadReport=()=>{

generateReport(

project,

materialTotal,

expenseTotal,

assignedWorkers

);

};


const deleteProject=async()=>{

await deleteDoc(

doc(db,"projects",id)

);

alert("Deleted");

navigate("/projects");

};


const loadExpenses=async()=>{

const data=await getDocs(

collection(db,"expenses")

);

let total=0;

data.docs.forEach(doc=>{

const item=doc.data();

if(item.projectId===id){

total += Number(item.amount || 0);

}

});

setExpenseTotal(total);

};


if(!project)

return <h2>Loading...</h2>;


return(

<AdminLayout>

<div className="project-details">


<div className="details-header">

<div>

<h1>

{project.name}

</h1>

<p>

📍 {project.location}

</p>

</div>

<span className="status">

{project.status || "Running"}

</span>

<button

className="add-btn"

onClick={deleteProject}

>

Delete Project

</button>

<button

className="add-btn"

onClick={downloadReport}

>

📄 Download Report

</button>

<button

className="add-btn"

onClick={()=>navigate(`/edit-project/${id}`)}

>

✏️ Edit Project

</button>

<button

className="add-btn"

onClick={()=>navigate(`/daily-update/${id}`)}

>

📝 Daily Update

</button>

<button

className="add-btn"

onClick={()=>navigate(`/assign-workers/${id}`)}

>

👷 Assign Workers

</button>

</div>


<div className="details-grid">


<div className="detail-card">

<h3>Client</h3>

<h2>{project.client}</h2>

<p>{project.clientEmail}</p>

</div>


<div className="detail-card">

<h3>Materials</h3>

<h2>₹ {materialTotal}</h2>

<button

className="add-btn"

onClick={()=>navigate(`/materials/${id}`)}

>

📦 Manage Materials

</button>

</div>


<div className="detail-card">

<h3>Expenses</h3>

<h2>₹ {expenseTotal}</h2>

<button

className="add-btn"

onClick={()=>navigate(`/expenses/${id}`)}

>

💰 Manage Expenses

</button>

</div>


<div className="detail-card">

<h3>Completion</h3>

<div

className="circle"

style={{

background:

`conic-gradient(#07883f ${project.progress}%, #ddd ${project.progress}%)`

}}

>

<div>

{project.progress}%

</div>

</div>

</div>


<div className="detail-card">

<h3>

Remaining Budget

</h3>

<h2>

₹{project.budget-spent}

</h2>

</div>


</div>


<div className="dashboard-box">

<h2>Assigned Workers</h2>

{

assignedWorkers.length===0

&&

<p>No workers assigned</p>

}

{

assignedWorkers.map(w=>(

<p key={w.workerId}>

👷 {w.workerName} - {w.role}

</p>

))

}

</div>


</div>

</AdminLayout>

)

}



export default ProjectDetails;
