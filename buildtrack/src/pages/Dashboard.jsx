import {useEffect,useState} from "react";

import AdminLayout from "../layouts/AdminLayout";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
}
from "recharts";

import {
PieChart,
Pie,
Cell
}
from "recharts";


import {
collection,
getDocs
}
from "firebase/firestore";


import {db} from "../firebase/firebaseConfig";



function Dashboard(){


const [projects,setProjects]=useState([]);

const [workers,setWorkers]=useState([]);

const [expenses,setExpenses]=useState([]);

const [updates,setUpdates]=useState([]);




useEffect(()=>{


loadData();


},[]);




const loadData=async()=>{


const projectData=await getDocs(

collection(db,"projects")

);



const workerData=await getDocs(

collection(db,"workers")

);



const expenseData=await getDocs(

collection(db,"expenses")

);



const updateData=await getDocs(

collection(db,"dailyUpdates")

);



setProjects(

projectData.docs.map(doc=>({

id:doc.id,

...doc.data()

}))

);



setWorkers(

workerData.docs.map(doc=>doc.data())

);



setExpenses(

expenseData.docs.map(doc=>doc.data())

);



setUpdates(

updateData.docs.map(doc=>doc.data())

);



};




const totalExpense = expenses.reduce(

(sum,item)=>sum + Number(item.amount),

0

);



const completedProjects = projects.filter(

item=>item.progress==100

).length;



const runningProjects = projects.filter(

item=>item.progress>0 && item.progress<100

).length;




const chartData = projects.map(project=>({

name:project.name,

progress:Number(project.progress)

}));



const expenseData = [

{
name:"Expenses",
value:totalExpense
}

];



return(


<AdminLayout>


<h1>

Dashboard

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

🟢 Running

</h2>


<h1>

{runningProjects}

</h1>


</div>




<div className="card">


<h2>

✅ Completed

</h2>


<h1>

{completedProjects}

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

📅 Updates

</h2>


<h1>

{updates.length}

</h1>


</div>



</div>




<div className="dashboard-box">


<h2>

Recent Projects

</h2>



{

projects.slice(0,5).map(project=>(


<div key={project.id}>


<h3>

{project.name}

</h3>


<p>

Status:

{

project.progress==100

?

"🟢 Completed"

:

project.progress>0

?

"🟡 Running"

:

"🔴 Not Started"

}


</p>


<hr/>


</div>


))


}



</div>



<div className="dashboard-box">


<h2>

Project Progress Chart

</h2>



<ResponsiveContainer width="100%" height={300}>


<BarChart data={chartData}>


<XAxis dataKey="name"/>

<YAxis/>


<Tooltip/>


<Bar

dataKey="progress"

/>


</BarChart>


</ResponsiveContainer>



</div>



<div className="dashboard-box">


<h2>

Expense Overview

</h2>



<ResponsiveContainer width="100%" height={250}>


<PieChart>


<Pie

data={expenseData}

dataKey="value"
nameKey="name"
outerRadius={80}
label

>


<Cell />


</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>



</div>



</AdminLayout>


)


}



export default Dashboard;
