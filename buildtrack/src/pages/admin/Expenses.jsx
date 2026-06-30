import {useEffect,useState} from "react";

import AdminLayout from "../../layouts/AdminLayout";


import {
collection,
addDoc,
getDocs
}
from "firebase/firestore";


import {db} from "../../firebase/firebaseConfig";



function Expenses(){


const [expenses,setExpenses]=useState([]);


const [title,setTitle]=useState("");

const [amount,setAmount]=useState("");

const [category,setCategory]=useState("");






useEffect(()=>{


loadExpenses();


},[]);







const loadExpenses=async()=>{


const data=await getDocs(

collection(db,"expenses")

);



const list=data.docs.map(doc=>(


{

id:doc.id,

...doc.data()

}


));



setExpenses(list);



};








const addExpense=async()=>{


if(!title || !amount || !category){


alert("Fill all fields");


return;


}



await addDoc(

collection(db,"expenses"),

{


title:title,


amount:Number(amount),


category:category,


date:new Date().toLocaleDateString()



}

);



alert("Expense Added");



setTitle("");

setAmount("");

setCategory("");



loadExpenses();



};






return(


<AdminLayout>


<h1>

Expenses

</h1>




<div className="form-box">


<input

placeholder="Expense Name"

value={title}

onChange={(e)=>setTitle(e.target.value)}

/>





<input

type="number"

placeholder="Amount"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

/>





<input

placeholder="Category"

value={category}

onChange={(e)=>setCategory(e.target.value)}

/>





<button

className="add-btn"

onClick={addExpense}

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

?

<h3>No Expenses Added</h3>


:


expenses.map(item=>(


<div

key={item.id}

>


<h3>

💰 {item.title}

</h3>


<p>

Amount: ₹{item.amount}

</p>



<p>

Category: {item.category}

</p>



<p>

Date: {item.date}

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