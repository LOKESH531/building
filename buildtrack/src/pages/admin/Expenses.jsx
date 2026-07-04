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



function Expenses(){


const {id}=useParams();



const [expenses,setExpenses]=useState([]);



const [title,setTitle]=useState("");

const [amount,setAmount]=useState("");

const [category,setCategory]=useState("");




useEffect(()=>{


load();


},[]);




const load=async()=>{


const data=await getDocs(

collection(db,"expenses")

);



setExpenses(

data.docs.map(doc=>(

{

id:doc.id,

...doc.data()

}

))

.filter(

e=> id ? e.projectId===id : true

)

);



};




const add=async()=>{


if(!title||!amount||!category){


alert("Fill all details");

return;


}



await addDoc(

collection(db,"expenses"),

{

projectId:id,

title:title,

amount:Number(amount),

category:category,

date:new Date().toLocaleDateString()

}

);



setTitle("");

setAmount("");

setCategory("");



load();


};




return(


<AdminLayout>



<div className="form-box">


<h1>

Expenses

</h1>



<input

placeholder="Expense Name"

value={title}

onChange={e=>setTitle(e.target.value)}

/>



<input

placeholder="Amount"

type="number"

value={amount}

onChange={e=>setAmount(e.target.value)}

/>



<select

value={category}

onChange={e=>setCategory(e.target.value)}

>


<option>

Select Category

</option>


<option>

Material

</option>


<option>

Labour

</option>


<option>

Transport

</option>


<option>

Equipment

</option>


<option>

Other

</option>


</select>



<button

className="add-btn"

onClick={add}

>

Add Expense

</button>


</div>




<div className="dashboard-box">


<h2>

Expense History

</h2>



{

expenses.length===0

&&

<h2>No Expenses Added</h2>

}


{

expenses.map(e=>(


<div key={e.id}>


<h3>

💰 {e.title}

</h3>


<p>

Category:

{e.category}

</p>


<p>

Amount:

₹{e.amount}

</p>


<p>

Date:

{e.date}

</p>



<hr/>


</div>


))


}



</div>



</AdminLayout>


)


}


export default Expenses;
