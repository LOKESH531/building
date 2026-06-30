import {useEffect,useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
collection,
addDoc,
getDocs
}
from "firebase/firestore";

import {db} from "../../firebase/firebaseConfig";

import {useParams} from "react-router-dom";



function Materials(){


const {id}=useParams();


const [materials,setMaterials]=useState([]);


const [name,setName]=useState("");

const [quantity,setQuantity]=useState("");

const [amount,setAmount]=useState("");




useEffect(()=>{

loadMaterials();

},[]);





const loadMaterials=async()=>{


const data=await getDocs(

collection(db,"materials")

);



const list=data.docs

.map(doc=>({

id:doc.id,

...doc.data()

}))

.filter(item=>item.projectId===id);



setMaterials(list);



};






const addMaterial=async()=>{


await addDoc(

collection(db,"materials"),

{


projectId:id,

name:name,

quantity:Number(quantity),

amount:Number(amount),

createdAt:new Date()



}

);



alert("Material Added");


setName("");

setQuantity("");

setAmount("");


loadMaterials();



};






return(


<AdminLayout>


<h1>

Project Materials

</h1>



<div className="form-box">


<input

placeholder="Material Name"

value={name}

onChange={e=>setName(e.target.value)}

/>



<input

placeholder="Quantity"

value={quantity}

onChange={e=>setQuantity(e.target.value)}

/>



<input

placeholder="Amount"

value={amount}

onChange={e=>setAmount(e.target.value)}

/>



<button

className="add-btn"

onClick={addMaterial}

>

Add Material

</button>



</div>






<div className="dashboard-box">


<h2>

Material History

</h2>



{

materials.map(item=>(


<div key={item.id}>


<h3>

📦 {item.name}

</h3>


<p>

Quantity:
{item.quantity}

</p>


<p>

Cost:
₹{item.amount}

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