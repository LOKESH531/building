import {useEffect,useState} from "react";


import {

collection,

getDocs,

where,

query

}

from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";


import ClientLayout from "../../layouts/ClientLayout";



function ClientDocuments(){


const [docs,setDocs]=useState([]);



useEffect(()=>{


load();


},[]);




const load=async()=>{


const client=

JSON.parse(

localStorage.getItem("client")

);



const q=query(

collection(db,"documents"),

where(

"projectId",

"==",

client.projectId

)

);



const data=await getDocs(q);



setDocs(

data.docs.map(doc=>(

{

id:doc.id,

...doc.data()

}

))

);



};




return(


<ClientLayout>


<div className="dashboard-box">


<h1>

📁 Documents

</h1>



{

docs.length===0

?

<h3>

No Documents Uploaded

</h3>


:


docs.map(d=>(


<div key={d.id}>


<h3>

{d.name}

</h3>


<button

className="add-btn"

onClick={()=>alert("Document feature coming soon")}

>

Open File

</button>



</div>


))


}



</div>



</ClientLayout>


)



}



export default ClientDocuments;
