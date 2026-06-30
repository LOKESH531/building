import {useEffect,useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";


import {
collection,
getDocs
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function Reports(){


const [projects,setProjects]=useState([]);

const [expenses,setExpenses]=useState([]);

const [workers,setWorkers]=useState([]);

const [materials,setMaterials]=useState([]);




useEffect(()=>{


loadReport();


},[]);




const loadReport=async()=>{


const projectData=await getDocs(

collection(db,"projects")

);


const expenseData=await getDocs(

collection(db,"expenses")

);


const workerData=await getDocs(

collection(db,"workers")

);


const materialData=await getDocs(

collection(db,"materials")

);



setProjects(

projectData.docs.map(doc=>({

id:doc.id,

...doc.data()

}))

);



setExpenses(

expenseData.docs.map(doc=>doc.data())

);



setWorkers(

workerData.docs.map(doc=>doc.data())

);



setMaterials(

materialData.docs.map(doc=>doc.data())

);



};




const totalExpense = expenses.reduce(

(sum,item)=>sum + Number(item.amount),

0

);




return(


<AdminLayout>


<h1>

Reports Dashboard

</h1>



<div className="cards">



<div className="card">


<h2>

🏗 Projects

</h2>


<h1>

{projects.length}

</h1>


</div>




<div className="card">


<h2>

👷 Workers

</h2>


<h1>

{workers.length}

</h1>


</div>




<div className="card">


<h2>

📦 Materials

</h2>


<h1>

{materials.length}

</h1>


</div>




<div className="card">


<h2>

💰 Expenses

</h2>


<h1>

₹{totalExpense}

</h1>


</div>



</div>




<div className="dashboard-box">


<h2>

Project Progress

</h2>



{

projects.map(project=>(


<div key={project.id}>


<h3>

{project.name}

</h3>


<p>

Status:
{project.status}

</p>


<div className="progress-bar">


<div

style={{

width:project.progress+"%"

}}

/>


</div>


<p>

{project.progress}% Completed

</p>


<hr/>


</div>



))


}




</div>



</AdminLayout>


)


}



export default Reports;
