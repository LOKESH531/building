import {useEffect,useState} from "react";


import {useParams} from "react-router-dom";


import {
doc,
getDoc,
collection,
getDocs
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";


import AdminLayout from "../../layouts/AdminLayout";



function ProjectDetails(){



const {id}=useParams();


const [project,setProject]=useState(null);


const [materialCost,setMaterialCost]=useState(0);


const [expense,setExpense]=useState(0);




useEffect(()=>{


loadProject();


loadMaterials();


loadExpenses();


},[]);




const loadProject=async()=>{


const ref=doc(

db,

"projects",

id

);



const snap=await getDoc(ref);



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


total += Number(item.amount || 0);


}



});



setMaterialCost(total);



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



setExpense(total);


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




<span

className={

project.status==="Completed"

?

"status completed"

:

"status running"

}

>

{project.status || "Running"}

</span>



</div>




<div className="details-grid">




<div className="detail-card">


<h3>

Client

</h3>


<p>

👤 {project.client}

</p>



<p>

📧 {project.clientEmail}

</p>



</div>




<div className="detail-card">


<h3>

Budget

</h3>


<h2>

₹ {project.budget}

</h2>



</div>




<div className="detail-card">


<h3>

Materials Cost

</h3>


<h2>

₹ {materialCost}

</h2>



</div>




<div className="detail-card">


<h3>

Expenses

</h3>


<h2>

₹ {expense}

</h2>



</div>



</div>




<div className="progress-card">



<h2>

Project Progress

</h2>



<div className="circle"


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




</div>



</AdminLayout>



)


}



export default ProjectDetails;
