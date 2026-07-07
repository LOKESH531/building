import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import ClientLayout from "../../layouts/ClientLayout";
import { useAuth } from "../../context/AuthContext";

function ClientDashboard() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [spent, setSpent] = useState(0);
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClientDashboard();
  }, [currentUser, userData]);

  const loadClientDashboard = async () => {
    if (!currentUser || !userData) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let clientProject = null;

      const assignedProjectId =
        userData.projectId ||
        userData.assignedProjectId ||
        userData.assignedProjects?.[0];

      if (assignedProjectId) {
        const projectSnap = await getDoc(doc(db, "projects", assignedProjectId));
        if (projectSnap.exists()) {
          clientProject = { id: projectSnap.id, ...projectSnap.data() };
        }
      }

      if (!clientProject && userData.email) {
        const q = query(collection(db, "projects"), where("clientEmail", "==", userData.email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          clientProject = { id: snap.docs[0].id, ...snap.docs[0].data() };
        }
      }

      if (!clientProject) {
        setProject(null);
        setMessage("No project assigned to this client yet.");
        setLoading(false);
        return;
      }

      setProject(clientProject);

      const expenseSnap = await getDocs(
        query(collection(db, "expenses"), where("projectId", "==", clientProject.id))
      );
      let totalExpense = 0;
      expenseSnap.docs.forEach((d) => {
        const e = d.data();
        totalExpense += Number(e.amount || e.cost || 0);
      });
      setSpent(totalExpense);

      const updateSnap = await getDocs(
        query(collection(db, "dailyUpdates"), where("projectId", "==", clientProject.id))
      );
      setUpdates(updateSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Client dashboard error:", error);
      setMessage(error.message || "Unable to load client dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="client-page"><h2>Loading...</h2></div>
      </ClientLayout>
    );
  }

  if (!project) {
    return (
      <ClientLayout>
        <div className="client-page">
          <h1>Welcome 👋</h1>
          <div className="dashboard-box">
            <h2>No Project Assigned</h2>
            <p>{message}</p>
            <p>Please ask the admin to assign a project to this client account.</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="client-page">
        <h1>Welcome 👋</h1>

        <div className="dashboard-box">
          <h2>{project.name || project.projectName || "Project"}</h2>
          <p>📍 {project.location || "No location added"}</p>
          <span className="status">{project.status || "Pending"}</span>
        </div>

        <div className="cards">
          <div className="card clickable" onClick={() => navigate("/client-updates")}>
            <h2>📝 Updates</h2>
            <h1>{updates.length}</h1>
            <p>View Work</p>
          </div>

          <div className="card clickable" onClick={() => navigate("/client-expenses")}>
            <h2>💰 Expenses</h2>
            <h1>₹{spent.toLocaleString("en-IN")}</h1>
            <p>View Details</p>
          </div>

          <div className="card clickable" onClick={() => navigate("/client-progress")}>
            <h2>📊 Progress</h2>
            <h1>{project.progress || 0}%</h1>
            <p>Track Project</p>
          </div>

          <div className="card clickable" onClick={() => navigate("/client-documents")}>
            <h2>📁 Documents</h2>
            <p>View Files</p>
          </div>
        </div>

        <div className="dashboard-box">
          <h2>Latest Updates</h2>
          {updates.length === 0 ? (
            <p>No daily updates added yet.</p>
          ) : (
            updates.slice(0, 3).map((u) => (
              <div key={u.id}>
                <h3>📅 {u.date || "No date"}</h3>
                <p>{u.workDone || u.completed || "No update details"}</p>
              </div>
            ))
          )}
          <button className="add-btn" onClick={() => navigate("/client-updates")}>
            View All Updates
          </button>
        </div>
      </div>
    </ClientLayout>
  );
}

export default ClientDashboard;
