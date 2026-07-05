import {doc,updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebaseConfig";

const STAGES=["Foundation","Ground Floor","First Floor","Roof","Painting","Finishing"];
const TOTAL=7;

function Milestones({project,onUpdate}){
  const completed=project.completedStages||[];

  const toggle=async(item)=>{
    const updated=completed.includes(item)
      ?completed.filter(s=>s!==item)
      :[...completed,item];
    const progress=Math.round((updated.length/TOTAL)*100);
    await updateDoc(doc(db,"projects",project.id),{
      completedStages:updated,
      progress
    });
    onUpdate&&onUpdate();
  };

  return(
    <div className="dashboard-box">
      <h2>Milestones</h2>
      {STAGES.map(item=>(
        <div key={item} className="milestone-item">
          <input
            type="checkbox"
            checked={completed.includes(item)}
            onChange={()=>toggle(item)}
          />
          <span>{item}</span>
        </div>
      ))}
      <p style={{marginTop:"12px",color:"#6b7280"}}>
        Progress: {Math.round((completed.length/TOTAL)*100)}%
      </p>
    </div>
  );
}

export default Milestones;
