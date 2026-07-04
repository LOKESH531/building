import {useEffect,useState} from "react";

import {
collection,
getDocs,
query,
where
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function ClientUpdates(){


const [updates,setUpdates]=useState([]);



useEffect(()=>{


load();


},[]);




const load=async()=>{


const client=

JSON.parse(localStorage.getItem("client"));



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




return(


<div className="dashboard-box">


<h1>

Daily Work Updates

</h1>



{

updates.length===0

&&

<h2>No Updates Found</h2>

}


{

updates.map(item=>(


<div key={item.id}>


<h3>

📅 {item.date}

</h3>


<p>

Work:
{item.workDone}

</p>


<p>

Workers:
{item.workers}

</p>


<p>

Problem:
{item.problems}

</p>


<hr/>


</div>


))

}



</div>


)


}


export default ClientUpdates;
