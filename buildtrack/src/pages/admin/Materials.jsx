import {useEffect,useState} from "react";


import {

collection,

addDoc,

getDocs

}

from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";


import {

useParams

}

from "react-router-dom";


import AdminLayout from "../../layouts/AdminLayout";



function Materials(){



const {id}=useParams();



const [items,setItems]=useState([]);



const [name,setName]=useState("");

const [buy,setBuy]=useState("");

const [used,setUsed]=useState("");

const [cost,setCost]=useState("");




useEffect(()=>{

load();

},[]);




const load=async()=>{


const data=await getDocs(

collection(db,"materials")

);



setItems(

data.docs.map(doc=>(

{

id:doc.id,

...doc.data()

}

))

.filter(

m=>m.projectId===id

)

);



};




const add=async()=>{


if(!name||!buy||!cost){

alert("Fill details");

return;

}



await addDoc(

collection(db,"materials"),

{

projectId:id,

name:name,

purchaseQty:Number(buy),

usedQty:Number(used),

cost:Number(cost)

}

);



load();


};




return(


<AdminLayout>


<div className="form-box">


<h1>

Materials

</h1>



<input

placeholder="Material"

onChange={e=>setName(e.target.value)}

/>



<input

placeholder="Purchase Qty"

onChange={e=>setBuy(e.target.value)}

/>



<input

placeholder="Used Qty"

onChange={e=>setUsed(e.target.value)}

/>



<input

placeholder="Cost"

onChange={e=>setCost(e.target.value)}

/>



<button

className="add-btn"

onClick={add}

>

Add Material

</button>


</div>




<div className="dashboard-box">


<h2>

Stock

</h2>



{

items.length===0

&&

<h2>No Materials Added</h2>

}


{

items.map(m=>(


<div key={m.id}>


<h3>

📦 {m.name}

</h3>


<p>

Bought:

{m.purchaseQty}

</p>


<p>

Used:

{m.usedQty}

</p>


<p>

Remaining:

{m.purchaseQty-m.usedQty}

</p>


<p>

Cost:

₹{m.cost}

</p>


<hr/>


</div>


))


}



</div>



</AdminLayout>


)


}


export default Materials;
