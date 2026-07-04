import {useEffect,useState} from "react";

import {
doc,
getDoc,
updateDoc
}
from "firebase/firestore";

import {db} from "../../firebase/firebaseConfig";

import {
useParams,
useNavigate
}
from "react-router-dom";


import AdminLayout from "../../layouts/AdminLayout";



function EditProject(){


const {id}=useParams();

const navigate=useNavigate();


const [project,setProject]=useState(null);



useEffect(()=>{

loadProject();

},[]);



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




const updateProject=async()=>{


await updateDoc(

doc(db,"projects",id),

{

...project,

updatedAt:new Date()

}

);


alert("Project Updated");


navigate(`/project/${id}`);


};




if(!project)

return <h2>Loading...</h2>;




return(


<AdminLayout>


<div className="form-box">


<h1>

Edit Project

</h1>



<input

value={project.name}

onChange={e=>

setProject({

...project,

name:e.target.value

})

}

/>



<input

value={project.location}

onChange={e=>

setProject({

...project,

location:e.target.value

})

}

/>



<input

type="number"

value={project.budget}

onChange={e=>

setProject({

...project,

budget:e.target.value

})

}

/>



<input

type="number"

value={project.progress}

onChange={e=>{


let p=Number(e.target.value);


setProject({

...project,

progress:p,

status:p===100?"Completed":"Running"

})


}}

/>



<button

className="add-btn"

onClick={updateProject}

>

Save Changes

</button>


</div>


</AdminLayout>


)

}


export default EditProject;
