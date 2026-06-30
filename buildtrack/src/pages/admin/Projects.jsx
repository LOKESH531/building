import {useEffect,useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
collection,
getDocs
}
from "firebase/firestore";

import {db} from "../../firebase/firebaseConfig";

import {useNavigate} from "react-router-dom";



function Projects(){


const navigate=useNavigate();


const [projects,setProjects]=useState([]);



useEffect(()=>{

loadProjects();

},[]);




const loadProjects=async()=>{


try{


const snap = await getDocs(

collection(db,"projects")

);



const list = snap.docs.map((doc)=>(

{

id:doc.id,

...doc.data()

}

));



console.log("Projects:",list);



setProjects(list);



}

catch(error){


console.log("Project Error:",error);


alert(error.message);


}


};





return(


<AdminLayout>


<h1>

Projects

</h1>



<button

className="add-btn"

onClick={()=>navigate("/create-project")}

>

+ Create Project

</button>





<div className="project-grid">


{

projects.length === 0 ?


<h2>No Projects Found</h2>


:


projects.map((project)=>(



<div

className="project-card"

key={project.id}

onClick={()=>navigate(`/project/${project.id}`)}

>


<h2>

{project.name}

</h2>



<p>

Client: {project.client}

</p>



<p>

Location: {project.location}

</p>




<div className="progress-bar">


<div

style={{

width: `${project.progress}%`

}}


/>


</div>





<h3>

{project.progress}% Completed

</h3>



<p>

Status:

<span

className={

"status " + project.status?.toLowerCase().replace(" ","-")

}

>

{project.status}

</span>

</p>



<p>

Completion:

{project.end}

</p>




</div>



))


}



</div>



</AdminLayout>


)


}



export default Projects;