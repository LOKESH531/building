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



function ClientExpenses(){


const [expenses,setExpenses]=useState([]);



useEffect(()=>{


load();


},[]);




const load=async()=>{


const client=

JSON.parse(

localStorage.getItem("client")

);



const q=query(

collection(db,"expenses"),

where(

"projectId",

"==",

client.projectId

)

);



const data=await getDocs(q);



setExpenses(

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

💰 Expense History

</h1>



{

expenses.length===0

?

<h3>

No Expenses

</h3>


:


expenses.map(e=>(


<div

key={e.id}

className="card"

>


<h3>

{e.title}

</h3>


<p>

Category:

{e.category}

</p>


<h2>

₹{e.amount}

</h2>


<p>

{e.date}

</p>


</div>


))


}



</div>


</ClientLayout>


)



}


export default ClientExpenses;
