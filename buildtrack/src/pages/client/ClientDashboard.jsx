import {useEffect,useState} from "react";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
}
from "firebase/firestore";

import {db} from "../../firebase/firebaseConfig";

import ClientLayout from "../../layouts/ClientLayout";

import {useNavigate} from "react-router-dom";



function ClientDashboard(){


const navigate=useNavigate();


const [project,setProject]=useState(null);

const [spent,setSpent]=useState(0);

const [updates,setUpdates]=useState([]);




useEffect(()=>{


load();


},[]);




const load=async()=>{


const client=

JSON.parse(

localStorage.getItem("client")

);



if(!client)return;



// PROJECT


const snap=await getDoc(

doc(

db,

"projects",

client.projectId

)

);



if(snap.exists()){


setProject({

id:snap.id,

...snap.data()

});


}




// EXPENSES


const expenses=await getDocs(

collection(db,"expenses")

);



let total=0;



expenses.docs.forEach(doc=>{


const e=doc.data();


if(e.projectId===client.projectId){


total+=Number(e.amount||0);


}


});



setSpent(total);




// UPDATES


const q=query(

collection(db,"dailyUpdates"),

where(

"projectId",

"==",

client.projectId

)

);



const data=await getDocs(q);



setUpdates(

data.docs.map(doc=>(

{

id:doc.id,

...doc.data()

}

))

);



};




if(!project)

return <h2>Loading...</h2>;




return(


<ClientLayout>



<div className="client-page">


<h1>

Welcome 👋

</h1>




<div className="dashboard-box">


<h2>

{project.name}

</h2>


<p>

📍 {project.location}

</p>


<span className="status">

{project.status}

</span>



</div>




<div className="cards">



<div

className="card clickable"

onClick={()=>navigate(`/client-updates`)}

>


<h2>

📝 Updates

</h2>


<h1>

{updates.length}

</h1>


<p>

View Work

</p>


</div>




<div

className="card clickable"

onClick={()=>navigate(`/client-expenses`)}

>


<h2>

💰 Expenses

</h2>


<h1>

₹{spent}

</h1>


<p>

View Details

</p>


</div>




<div

className="card clickable"

onClick={()=>navigate(`/client-progress`)}

>


<h2>

📊 Progress

</h2>


<h1>

{project.progress}%

</h1>


<p>

Track Project

</p>


</div>




<div

className="card clickable"

onClick={()=>navigate("/client-documents")}

>


<h2>

📁 Documents

</h2>


<p>

View Files

</p>


</div>




</div>




<div className="dashboard-box">


<h2>

Latest Updates

</h2>



{

updates.slice(0,3).map(u=>(


<div key={u.id}>


<h3>

📅 {u.date}

</h3>


<p>

{u.workDone}

</p>


</div>


))


}



<button

className="add-btn"

onClick={()=>navigate("/client-updates")}

>

View All Updates

</button>



</div>




</div>



</ClientLayout>


)


}



export default ClientDashboard;
