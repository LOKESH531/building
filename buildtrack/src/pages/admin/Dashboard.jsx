import {useEffect,useState} from "react";
import {collection,getDocs,addDoc,query,orderBy,limit} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig";
import AdminLayout from "../../layouts/AdminLayout";
import {useNavigate} from "react-router-dom";
import {
  BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,
  PieChart,Pie,Cell,Legend
} from "recharts";
import GlobalSearch from "../../components/GlobalSearch";

const COLORS=["#07883f","#f59e0b","#ef4444","#3b82f6"];

function Dashboard(){
  const navigate=useNavigate();
  const [stats,setStats]=useState({projects:0,workers:0,materials:0,expenses:0,budget:0,updates:0});
  const [recentProjects,setRecentProjects]=useState([]);
  const [status,setStatus]=useState({ongoing:0,completed:0,pending:0});
  const [recentExpenses,setRecentExpenses]=useState([]);
  const [lowStock,setLowStock]=useState([]);
  const [activities,setActivities]=useState([]);
  const [upcomingDeadlines,setUpcomingDeadlines]=useState([]);
  const [monthlyData,setMonthlyData]=useState([]);

  useEffect(()=>{loadDashboard();},[]);

  const loadDashboard=async()=>{
    const [projectSnap,workerSnap,materialSnap,expenseSnap,updateSnap,activitySnap]=
      await Promise.all([
        getDocs(collection(db,"projects")),
        getDocs(collection(db,"workers")),
        getDocs(collection(db,"materials")),
        getDocs(collection(db,"expenses")),
        getDocs(collection(db,"dailyUpdates")),
        getDocs(collection(db,"activities")),
      ]);

    // --- field-name helpers (supports multiple naming conventions) ---
    const getBudget =p=>Number(p.budget??p.projectBudget??p.totalBudget??p.estimatedBudget??0);
    const getStatus =p=>p.status??p.projectStatus??p.state??"";
    const getProgress=p=>Number(p.progress??p.completion??p.percent??0);
    const getEndDate =p=>p.endDate??p.dueDate??p.deadline??null;
    const getExpAmt  =e=>Number(e.amount??e.expenseAmount??e.total??e.price??e.cost??0);
    const getExpTitle=e=>e.title??e.name??e.description??"Expense";
    const getMatQty  =m=>Number(m.quantity??m.qty??m.stock??0);
    const getMatName =m=>m.name??m.materialName??m.item??"Material";
    const getWorkerCount=()=>workerSnap.size||
      projectSnap.docs.reduce((acc,d)=>acc+Number(d.data().workerCount??d.data().workers??0),0);

    console.log("Projects");
    projectSnap.docs.forEach(doc=>console.log(doc.id,doc.data()));
    console.log("Expenses");
    expenseSnap.docs.forEach(doc=>console.log(doc.id,doc.data()));
    console.log("Materials");
    materialSnap.docs.forEach(doc=>console.log(doc.id,doc.data()));

    let totalBudget=0,totalExpense=0;
    let ongoing=0,completed=0,pending=0;
    const projects=projectSnap.docs.map(doc=>({id:doc.id,...doc.data()}));

    projects.forEach(p=>{
      totalBudget+=getBudget(p);
      const s=getStatus(p).toLowerCase();
      if(s==="completed") completed++;
      else if(s==="ongoing") ongoing++;
      else pending++;
    });
    setStatus({ongoing,completed,pending});

    const expenses=expenseSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
    expenses.forEach(e=>{totalExpense+=getExpAmt(e);});
    setRecentExpenses(
      [...expenses]
        .sort((a,b)=>getExpAmt(b)-getExpAmt(a))
        .slice(0,5)
        .map(e=>({...e,_amount:getExpAmt(e),_title:getExpTitle(e)}))
    );

    const materials=materialSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
    setLowStock(
      materials
        .filter(m=>getMatQty(m)<10)
        .map(m=>({...m,_qty:getMatQty(m),_name:getMatName(m)}))
    );

    setStats({
      projects:projects.length,
      workers:getWorkerCount(),
      materials:materialSnap.size,
      expenses:totalExpense,
      budget:totalBudget,
      updates:updateSnap.size
    });
    setRecentProjects(
      projects.slice(0,5).map(p=>({...p,_budget:getBudget(p),_status:getStatus(p),_progress:getProgress(p),_endDate:getEndDate(p)}))
    );

    const today=new Date();
    const deadlines=projects
      .filter(p=>getEndDate(p)&&getStatus(p).toLowerCase()!=="completed")
      .map(p=>{
        const due=new Date(getEndDate(p));
        const diff=Math.ceil((due-today)/(1000*60*60*24));
        return{...p,_name:p.name??p.projectName??p.id,daysLeft:diff};
      })
      .filter(p=>p.daysLeft<=7)
      .sort((a,b)=>a.daysLeft-b.daysLeft)
      .slice(0,5);
    setUpcomingDeadlines(deadlines);

    const monthMap={};
    expenses.forEach(e=>{
      const month=e.month??e.date?.split("/")[0]??"N/A";
      monthMap[month]=(monthMap[month]||0)+getExpAmt(e);
    });
    setMonthlyData(Object.entries(monthMap).map(([month,amount])=>({month,amount})));

    const acts=activitySnap.docs.map(d=>({id:d.id,...d.data()}));
    setActivities(acts.slice(-5).reverse());
  };

  const health=
    stats.expenses>stats.budget?"Over Budget":
    stats.expenses>stats.budget*0.8?"At Risk":"Healthy";

  const percent=stats.budget>0?Math.min(100,(stats.expenses/stats.budget)*100):0;

  const pieData=[
    {name:"Ongoing",value:status.ongoing},
    {name:"Completed",value:status.completed},
    {name:"Pending",value:status.pending},
  ];

  return(
    <AdminLayout>
      <h1>Dashboard</h1>

      <GlobalSearch/>

      {/* Quick Stats */}
      <div className="cards" style={{marginTop:"20px"}}>
        <div className="card"><h3>Total Projects</h3><h1>{stats.projects}</h1></div>
        <div className="card"><h3>Workers</h3><h1>{stats.workers}</h1></div>
        <div className="card"><h3>Materials</h3><h1>{stats.materials}</h1></div>
        <div className="card"><h3>Updates</h3><h1>{stats.updates}</h1></div>
        <div className="card"><h3>Total Budget</h3><h1>₹{stats.budget.toLocaleString()}</h1></div>
        <div className="card"><h3>Total Expenses</h3><h1>₹{stats.expenses.toLocaleString()}</h1></div>
        <div className="card">
          <h3>Project Health</h3>
          <h1>
            {health==="Healthy"&&"🟢 "}
            {health==="At Risk"&&"🟡 "}
            {health==="Over Budget"&&"🔴 "}
            {health}
          </h1>
        </div>
      </div>

      {/* Project Status */}
      <div className="dashboard-box">
        <h2>Project Status</h2>
        <div className="cards">
          <div className="card"><h3>🟢 Ongoing</h3><h1>{status.ongoing}</h1></div>
          <div className="card"><h3>✅ Completed</h3><h1>{status.completed}</h1></div>
          <div className="card"><h3>⏳ Pending</h3><h1>{status.pending}</h1></div>
          <div className="card"><h3>💵 Remaining Budget</h3><h1>₹{(stats.budget-stats.expenses).toLocaleString()}</h1></div>
        </div>
      </div>

      {/* Budget Utilization */}
      <div className="dashboard-box">
        <h2>Budget Utilization</h2>
        <div className="progress">
          <div className="progress-fill" style={{width:`${percent}%`}}/>
        </div>
        <p style={{marginTop:"8px"}}>{percent.toFixed(1)}% used</p>
      </div>

      {/* Charts */}
      <div className="dashboard-box">
        <h2>Project Status Chart</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
            </Pie>
            <Legend/>
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {monthlyData.length>0&&(
        <div className="dashboard-box">
          <h2>Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="amount" fill="#07883f" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-box">
        <h2>Quick Actions</h2>
        <div className="cards">
          <button className="add-btn" onClick={()=>navigate("/add-project")}>➕ Add Project</button>
          <button className="add-btn" onClick={()=>navigate("/workers")}>👷 Workers</button>
          <button className="add-btn" onClick={()=>navigate("/materials")}>📦 Materials</button>
          <button className="add-btn" onClick={()=>navigate("/reports")}>📊 Reports</button>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length>0&&(
        <div className="dashboard-box">
          <h2>⚠ Upcoming Deadlines</h2>
          {upcomingDeadlines.map(p=>(
            <div key={p.id} className="deadline-item">
              <span>⚠ {p._name}</span>
              <span className={p.daysLeft<0?"deadline-overdue":"deadline-soon"}>
                {p.daysLeft<0?`Delayed by ${Math.abs(p.daysLeft)} days`:
                 p.daysLeft===0?"Due Today":`${p.daysLeft} day(s) left`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Projects */}
      <div className="dashboard-box">
        <h2>Recent Projects</h2>
        {recentProjects.length===0?<p>No Projects Available</p>:
          recentProjects.map(project=>(
            <div key={project.id} className="project-card" style={{marginBottom:"15px"}}>
              <h3>{project.name??project.projectName??project.id}</h3>
              <p>📍 {project.location??project.address??"—"}</p>
              <p>Status : {project._status||"—"}</p>
              <p>Progress : {project._progress}%</p>
              <button className="add-btn" onClick={()=>navigate(`/project-details/${project.id}`)}>Open Project</button>
            </div>
          ))
        }
      </div>

      {/* Recent Expenses */}
      <div className="dashboard-box">
        <h2>Recent Expenses</h2>
        {recentExpenses.length===0?<p>No Expenses</p>:recentExpenses.map(e=>(
          <div key={e.id}>
            <h3>{e._title}</h3>
            <p>₹{e._amount}</p>
            <hr/>
          </div>
        ))}
      </div>

      {/* Low Stock */}
      <div className="dashboard-box">
        <h2>Low Stock Materials</h2>
        {lowStock.length===0?<p>All materials sufficiently stocked</p>:lowStock.map(m=>(
          <div key={m.id}>
            <h3>{m._name}</h3>
            <p>Remaining : {m._qty}</p>
            <hr/>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="dashboard-box">
        <h2>Recent Activities</h2>
        {activities.length===0?<p>No recent activity</p>:activities.map(a=>(
          <div key={a.id} className="activity-item">
            <span className={`activity-badge activity-${a.type}`}>{a.type}</span>
            <span>{a.title}</span>
            <span className="activity-date">{a.date}</span>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}

export default Dashboard;
