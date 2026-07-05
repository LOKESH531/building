import {useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {db} from "../../firebase/firebaseConfig";

import {
collection,
addDoc
}
from "firebase/firestore";



function CreateProject(){


const [project,setProject]=useState({

name:"",
client:"",
location:"",
budget:"",
start:"",
end:""

});


const [clientEmail,setClientEmail]=useState("");



const handleChange=(e)=>{


setProject({

...project,

[e.target.name]:e.target.value

});


};



const saveProject=async()=>{


try{


await addDoc(

collection(db,"projects"),

{

...project,

progress:0,

status:"Not Started",

clientEmail:clientEmail,

createdAt:new Date().toLocaleDateString()

}

);



alert("Project Created Successfully");



setProject({

name:"",
client:"",
location:"",
budget:"",
start:"",
end:""

});

setClientEmail("");



}

catch(error){


console.log(error);

alert(error.message);


}



};



return(

<AdminLayout>


<h1>
Create New Project
</h1>



<div className="form-box">


<input

name="name"

placeholder="Project Name"

value={project.name}

onChange={handleChange}

/>



<input

name="client"

placeholder="Client Name"

value={project.client}

onChange={handleChange}

/>



<input

name="location"

placeholder="Location"

value={project.location}

onChange={handleChange}

/>



<input

name="budget"

placeholder="Budget"

value={project.budget}

onChange={handleChange}

/>



<label>
Client Email
</label>


<input

placeholder="Client Email"

value={clientEmail}

onChange={(e)=>setClientEmail(e.target.value)}

/>



<label>
Start Date
</label>


<input

type="date"

name="start"

value={project.start}

onChange={handleChange}

/>



<label>
Expected Completion
</label>


<input

type="date"

name="end"

value={project.end}

onChange={handleChange}

/>



<button

className="add-btn"

onClick={saveProject}

>

Save Project

</button>



</div>



</AdminLayout>

)

}


export default CreateProject;