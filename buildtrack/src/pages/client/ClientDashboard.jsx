import {useEffect,useState} from "react";

import {
doc,
getDoc
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function ClientDashboard(){


const [project,setProject]=useState(null);



useEffect(()=>{


loadProject();


},[]);





const loadProject=async()=>{


const client = JSON.parse(

localStorage.getItem("client")

);



if(!client){

return;

}



const ref=doc(

db,

"projects",

client.projectId

);



const snap=await getDoc(ref);



if(snap.exists()){


setProject({

id:snap.id,

...snap.data()

});


}



};






if(!project)

return <h2>Loading...</h2>;






return(


<div className="center">


<div className="dashboard-box">


<h1>

Welcome {JSON.parse(localStorage.getItem("client")).name}

</h1>



<h2>

Project Details

</h2>




<p>

Project:

{project.name}

</p>



<p>

Location:

{project.location}

</p>




<p>

Progress:

{project.progress}%

</p>



<div className="progress-bar">


<div

style={{

width:project.progress+"%"

}}

/>


</div>





<p>

Status:

{project.status}

</p>



</div>



</div>


)



}



export default ClientDashboard;