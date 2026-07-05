import {useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {doc,getDoc,collection,getDocs,deleteDoc,addDoc,updateDoc} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig";
import AdminLayout from "../../layouts/AdminLayout";
import generateReport from "../../utils/generateReport";
import ProjectTimeline from "../../components/ProjectTimeline";
import Milestones from "../../components/Milestones";

function ProjectDetails(){
  const {id}=useParams();
  const navigate=useNavigate();

  const [project,setProject]=useState(null);
  const [materialTotal,setMaterialTotal]=useState(0);
  const [expenseTotal,setExpenseTotal]=useState(0);
  const [assignedWorkers,setAssignedWorkers]=useState([]);
  const [spent,setSpent]=useState(0);
  const [materials,setMaterials]=useState([]);
  const [expenses,setExpenses]=useState([]);
  const [updates,setUpdates]=useState([]);
  const [activeTab,setActiveTab]=useState("overview");
  const [note,setNote]=useState("");
  const [notes,setNotes]=useState([]);

  useEffect(()=>{
    loadProject();
    loadMaterials();
    loadExpenses();
    loadWorkers();
    calculateSpent();
    loadUpdates();
    loadNotes();
  },[]);

  const calculateSpent=async()=>{
    const data=await getDocs(collection(db,"expenses"));
    let total=0;
    data.docs.forEach(d=>{
      const e=d.data();
      if(e.projectId===id) total+=Number(e.amount);
    });
    setSpent(total);
  };

  const loadWorkers=async()=>{
    const data=await getDocs(collection(db,"projectWorkers"));
    setAssignedWorkers(data.docs.map(d=>d.data()).filter(w=>w.projectId===id));
  };

  const loadProject=async()=>{
    const snap=await getDoc(doc(db,"projects",id));
    if(snap.exists()) setProject({id:snap.id,...snap.data()});
  };

  const loadMaterials=async()=>{
    const data=await getDocs(collection(db,"materials"));
    let total=0;const list=[];
    data.docs.forEach(d=>{
      const item={id:d.id,...d.data()};
      if(item.projectId===id){total+=Number(item.cost||item.amount||0);list.push(item);}
    });
    setMaterialTotal(total);setMaterials(list);
  };

  const loadExpenses=async()=>{
    const data=await getDocs(collection(db,"expenses"));
    let total=0;const list=[];
    data.docs.forEach(d=>{
      const item={id:d.id,...d.data()};
      if(item.projectId===id){total+=Number(item.amount||0);list.push(item);}
    });
    setExpenseTotal(total);setExpenses(list);
  };

  const loadUpdates=async()=>{
    const data=await getDocs(collection(db,"dailyUpdates"));
    setUpdates(data.docs.map(d=>({id:d.id,...d.data()})).filter(u=>u.projectId===id));
  };

  const loadNotes=async()=>{
    const data=await getDocs(collection(db,"notes"));
    setNotes(data.docs.map(d=>({id:d.id,...d.data()})).filter(n=>n.projectId===id));
  };

  const addNote=async()=>{
    if(!note.trim()) return;
    await addDoc(collection(db,"notes"),{
      projectId:id,
      text:note,
      date:new Date().toLocaleDateString()
    });
    setNote("");
    loadNotes();
  };

  const downloadReport=()=>generateReport(project,materialTotal,expenseTotal,assignedWorkers);

  const deleteProject=async()=>{
    await deleteDoc(doc(db,"projects",id));
    alert("Deleted");
    navigate("/projects");
  };

  // Delay detection
  const getDelay=()=>{
    if(!project?.endDate) return null;
    const today=new Date();
    const due=new Date(project.endDate);
    const diff=Math.ceil((today-due)/(1000*60*60*24));
    return diff>0?diff:null;
  };

  if(!project) return <h2>Loading...</h2>;

  const delay=getDelay();

  return(
    <AdminLayout>
      <div className="project-details">

        <div className="details-header">
          <div>
            <h1>{project.name}</h1>
            <p>📍 {project.location}</p>
          </div>
          <span className="status">{project.status||"Running"}</span>
          <button className="add-btn" onClick={deleteProject}>Delete Project</button>
          <button className="add-btn" onClick={downloadReport}>📄 Download Report</button>
          <button className="add-btn" onClick={()=>navigate(`/edit-project/${id}`)}>✏️ Edit Project</button>
          <button className="add-btn" onClick={()=>navigate(`/daily-update/${id}`)}>📝 Daily Update</button>
          <button className="add-btn" onClick={()=>navigate(`/assign-workers/${id}`)}>👷 Assign Workers</button>
        </div>

        {delay&&(
          <div className="delay-warning">
            ⚠ Project delayed by {delay} day{delay>1?"s":""}
          </div>
        )}

        <div className="tabs">
          {["overview","timeline","milestones","materials","workers","expenses","updates","notes"].map(tab=>(
            <button
              key={tab}
              className={activeTab===tab?"tab active":"tab"}
              onClick={()=>setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab==="overview"&&(
          <>
            <div className="dashboard-box">
              <h2>Project Overview</h2>
              <p><strong>Name:</strong> {project.name}</p>
              <p><strong>Client:</strong> {project.client}</p>
              <p><strong>Location:</strong> {project.location}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <p><strong>Progress:</strong> {project.progress}%</p>
              {project.endDate&&<p><strong>Due Date:</strong> {project.endDate}</p>}
            </div>
            <div className="details-grid">
              <div className="detail-card">
                <h3>Client</h3>
                <h2>{project.client}</h2>
                <p>{project.clientEmail}</p>
              </div>
              <div className="detail-card">
                <h3>Materials</h3>
                <h2>₹ {materialTotal}</h2>
                <button className="add-btn" onClick={()=>navigate(`/materials/${id}`)}>📦 Manage</button>
              </div>
              <div className="detail-card">
                <h3>Expenses</h3>
                <h2>₹ {expenseTotal}</h2>
                <button className="add-btn" onClick={()=>navigate(`/expenses/${id}`)}>💰 Manage</button>
              </div>
              <div className="detail-card">
                <h3>Completion</h3>
                <div className="circle" style={{background:`conic-gradient(#07883f ${project.progress}%, #ddd ${project.progress}%)`}}>
                  <div>{project.progress}%</div>
                </div>
              </div>
              <div className="detail-card">
                <h3>Remaining Budget</h3>
                <h2>₹{project.budget-spent}</h2>
              </div>
            </div>
          </>
        )}

        {activeTab==="timeline"&&<ProjectTimeline project={project}/>}

        {activeTab==="milestones"&&(
          <Milestones project={project} onUpdate={loadProject}/>
        )}

        {activeTab==="materials"&&(
          <div className="dashboard-box">
            <h2>Materials</h2>
            {materials.length===0?<p>No materials added</p>:materials.map(m=>(
              <div key={m.id}>
                <h3>{m.name}</h3>
                <p>Qty: {m.quantity} | Cost: ₹{m.cost||m.amount||0}</p>
                <hr/>
              </div>
            ))}
            <button className="add-btn" onClick={()=>navigate(`/materials/${id}`)}>📦 Manage Materials</button>
          </div>
        )}

        {activeTab==="workers"&&(
          <div className="dashboard-box">
            <h2>Workers</h2>
            {assignedWorkers.length===0?<p>No workers assigned</p>:assignedWorkers.map(w=>(
              <p key={w.workerId}>👷 {w.workerName} - {w.role}</p>
            ))}
            <button className="add-btn" style={{marginTop:"15px"}} onClick={()=>navigate(`/assign-workers/${id}`)}>👷 Assign Workers</button>
          </div>
        )}

        {activeTab==="expenses"&&(
          <div className="dashboard-box">
            <h2>Expenses</h2>
            {expenses.length===0?<p>No expenses recorded</p>:expenses.map(e=>(
              <div key={e.id}>
                <h3>{e.title}</h3>
                <p>₹{e.amount}</p>
                <hr/>
              </div>
            ))}
            <button className="add-btn" onClick={()=>navigate(`/expenses/${id}`)}>💰 Manage Expenses</button>
          </div>
        )}

        {activeTab==="updates"&&(
          <div className="dashboard-box">
            <h2>Daily Updates</h2>
            {updates.length===0?<p>No updates yet</p>:updates.map(u=>(
              <div key={u.id}>
                <h3>{u.date}</h3>
                <p>Work: {u.workDone}</p>
                <p>Workers: {u.workers}</p>
                <p>Problems: {u.problems}</p>
                <hr/>
              </div>
            ))}
            <button className="add-btn" onClick={()=>navigate(`/daily-update/${id}`)}>📝 Add Update</button>
          </div>
        )}

        {activeTab==="notes"&&(
          <div className="dashboard-box">
            <h2>📝 Sticky Notes</h2>
            <div className="notes-input-row">
              <input
                placeholder="Write a note..."
                value={note}
                onChange={e=>setNote(e.target.value)}
              />
              <button className="add-btn" onClick={addNote}>Add</button>
            </div>
            <div className="notes-grid">
              {notes.length===0?<p>No notes yet</p>:notes.map(n=>(
                <div key={n.id} className="sticky-note">
                  <p>{n.text}</p>
                  <small>{n.date}</small>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ProjectDetails;
