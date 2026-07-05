import {useEffect,useState} from "react";


import {

doc,

getDoc

}

from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";


import ClientLayout from "../../layouts/ClientLayout";



function ClientProgress(){



const [progress,setProgress]=useState(0);



useEffect(()=>{


load();


},[]);




const load=async()=>{


const client=

JSON.parse(

localStorage.getItem("client")

);



const snap=await getDoc(

doc(

db,

"projects",

client.projectId

)

);



setProgress(

snap.data().progress

);


};




return(


<ClientLayout>



<div className="dashboard-box">


<h1>

📊 Project Progress

</h1>



<div

className="circle"

style={{

background:

`conic-gradient(#07883f ${progress}%,#ddd ${progress}%)`

}}

>


<div>

{progress}%

</div>



</div>



</div>



</ClientLayout>


)


}


export default ClientProgress;
