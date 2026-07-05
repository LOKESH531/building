import {useEffect,useState} from "react";


import AdminLayout from "../../layouts/AdminLayout";


import {
collection,
getDocs
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function Reports(){


const [projects,setProjects]=useState(0);

const [workers,setWorkers]=useState(0);

const [materialCost,setMaterialCost]=useState(0);

const [expenseCost,setExpenseCost]=useState(0);

const [completed,setCompleted]=useState(0);




useEffect(()=>{


loadReports();


},[]);




const loadReports=async()=>{



const projectData=await getDocs(

collection(db,"projects")

);



const projectList=projectData.docs.map(doc=>doc.data());



setProjects(projectList.length);



setCompleted(

projectList.filter(

p=>p.status==="Completed"

).length

);




const workerData=await getDocs(

collection(db,"workers")

);


setWorkers(workerData.size);




const materialData=await getDocs(

collection(db,"materials")

);



let mTotal=0;



materialData.docs.forEach(doc=>{


mTotal += Number(

doc.data().amount || 0

);


});



setMaterialCost(mTotal);




const expenseData=await getDocs(

collection(db,"expenses")

);



let eTotal=0;



expenseData.docs.forEach(doc=>{


eTotal += Number(

doc.data().amount || 0

);


});



setExpenseCost(eTotal);



};




return(


<AdminLayout>



<h1>

Reports

</h1>




<div className="cards">



<div className="card">


<h2>

🏗 Projects

</h2>


<h1>

{projects}

</h1>


</div>




<div className="card">


<h2>

👷 Workers

</h2>


<h1>

{workers}

</h1>


</div>




<div className="card">


<h2>

📦 Materials

</h2>


<h1>

₹{materialCost}

</h1>


</div>




<div className="card">


<h2>

💰 Expenses

</h2>


<h1>

₹{expenseCost}

</h1>


</div>



</div>




<div className="dashboard-box">


<h2>

Project Completion

</h2>



<h1>

{completed} / {projects}

Completed

</h1>



</div>



</AdminLayout>


)


}



export default Reports;
