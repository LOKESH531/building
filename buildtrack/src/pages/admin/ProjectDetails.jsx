import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";
import AdminLayout from "../../layouts/AdminLayout";
import generateReport from "../../utils/generateReport";
import ProjectTimeline from "../../components/ProjectTimeline";
import Milestones from "../../components/Milestones";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [materialTotal, setMaterialTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [notes, setNotes] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadAllData();
  }, [id]);

  const parseNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (value) => `₹${parseNumber(value).toLocaleString("en-IN")}`;

  const getProjectName = (data) => data?.name || data?.projectName || "Untitled Project";
  const getClientName = (data) => data?.client || data?.clientName || "No client added";
  const getProgress = (data) => Math.min(100, Math.max(0, parseNumber(data?.progress || data?.completion || 0)));
  const getBudget = (data) => parseNumber(data?.budget || data?.projectBudget || data?.totalBudget || 0);
  const getEndDate = (data) => data?.endDate || data?.end || data?.dueDate || data?.deadline || "";

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadProject(),
        loadMaterials(),
        loadExpenses(),
        loadWorkers(),
        loadUpdates(),
        loadNotes(),
      ]);
    } catch (error) {
      console.error("Project details load failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async () => {
    const snap = await getDoc(doc(db, "projects", id));
    if (snap.exists()) setProject({ id: snap.id, ...snap.data() });
  };

  const loadMaterials = async () => {
    const snap = await getDocs(query(collection(db, "materials"), where("projectId", "==", id)));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setMaterials(list);
    setMaterialTotal(list.reduce((sum, item) => sum + parseNumber(item.cost || item.amount || item.totalCost), 0));
  };

  const loadExpenses = async () => {
    const snap = await getDocs(query(collection(db, "expenses"), where("projectId", "==", id)));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setExpenses(list);
    setExpenseTotal(list.reduce((sum, item) => sum + parseNumber(item.amount || item.cost || item.total), 0));
  };

  const loadWorkers = async () => {
    const snap = await getDocs(query(collection(db, "projectWorkers"), where("projectId", "==", id)));
    setAssignedWorkers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadUpdates = async () => {
    const snap = await getDocs(query(collection(db, "dailyUpdates"), where("projectId", "==", id)));
    setUpdates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadNotes = async () => {
    try {
      const snap = await getDocs(query(collection(db, "notes"), where("projectId", "==", id)));
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Notes load failed:", error);
      setNotes([]);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      await addDoc(collection(db, "notes"), {
        projectId: id,
        text: note,
        date: new Date().toLocaleDateString("en-IN"),
      });
      setNote("");
      loadNotes();
    } catch (error) {
      alert(error.message);
    }
  };

  const downloadReport = () => generateReport(project, materialTotal, expenseTotal, assignedWorkers);

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    await deleteDoc(doc(db, "projects", id));
    alert("Project deleted");
    navigate("/projects");
  };

  const getDelay = () => {
    const endDate = getEndDate(project);
    if (!endDate) return null;
    const diff = Math.ceil((new Date() - new Date(endDate)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  };

  if (loading) return <AdminLayout><h2>Loading project...</h2></AdminLayout>;

  if (!project) {
    return (
      <AdminLayout>
        <h2>Project not found</h2>
        <button className="add-btn" onClick={() => navigate("/projects")}>Back to Projects</button>
      </AdminLayout>
    );
  }

  const projectName = getProjectName(project);
  const clientName = getClientName(project);
  const budget = getBudget(project);
  const progress = getProgress(project);
  const remainingBudget = budget - expenseTotal;
  const delay = getDelay();

  return (
    <AdminLayout>
      <div className="project-details">
        <div className="details-header">
          <div>
            <h1>{projectName}</h1>
            <p>📍 {project.location || "No location added"}</p>
            <p>👤 Client: {clientName}</p>
          </div>

          <span className="status">{project.status || "Not Started"}</span>

          <button className="add-btn" onClick={() => navigate(`/edit-project/${id}`)}>✏️ Edit</button>
          <button className="add-btn" onClick={() => navigate(`/daily-update/${id}`)}>📝 Daily Update</button>
          <button className="add-btn" onClick={() => navigate(`/assign-workers/${id}`)}>👷 Assign Workers</button>
          <button className="add-btn" onClick={downloadReport}>📄 Report</button>
          <button className="add-btn" onClick={deleteProject}>🗑 Delete</button>
        </div>

        {delay && (
          <div className="delay-warning">
            ⚠ Project delayed by {delay} day{delay > 1 ? "s" : ""}
          </div>
        )}

        <div className="details-grid">
          <div className="detail-card"><h3>Total Budget</h3><h2>{formatCurrency(budget)}</h2></div>
          <div className="detail-card"><h3>Expenses</h3><h2>{formatCurrency(expenseTotal)}</h2></div>
          <div className="detail-card"><h3>Materials</h3><h2>{formatCurrency(materialTotal)}</h2></div>
          <div className="detail-card"><h3>Remaining Budget</h3><h2>{formatCurrency(remainingBudget)}</h2></div>
          <div className="detail-card">
            <h3>Completion</h3>
            <div className="circle" style={{ background: `conic-gradient(#07883f ${progress}%, #ddd ${progress}%)` }}>
              <div>{progress}%</div>
            </div>
          </div>
        </div>

        <div className="tabs">
          {["overview", "timeline", "milestones", "materials", "workers", "expenses", "updates", "notes"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="dashboard-box">
            <h2>Project Overview</h2>
            <p><strong>Name:</strong> {projectName}</p>
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Client Email:</strong> {project.clientEmail || "No email added"}</p>
            <p><strong>Location:</strong> {project.location || "No location added"}</p>
            <p><strong>Status:</strong> {project.status || "Not Started"}</p>
            <p><strong>Progress:</strong> {progress}%</p>
            <p><strong>Start Date:</strong> {project.startDate || project.start || "Not added"}</p>
            <p><strong>Due Date:</strong> {getEndDate(project) || "Not added"}</p>
          </div>
        )}

        {activeTab === "timeline" && <ProjectTimeline project={project} />}

        {activeTab === "milestones" && <Milestones project={project} onUpdate={loadProject} />}

        {activeTab === "materials" && (
          <div className="dashboard-box">
            <div className="panel-header">
              <div>
                <h2>Project Materials</h2>
                <p>Total: {formatCurrency(materialTotal)}</p>
              </div>
              <button className="add-btn" onClick={() => navigate(`/materials/${id}`)}>📦 Manage Materials</button>
            </div>

            {materials.length === 0 ? (
              <p>No materials added for this project.</p>
            ) : (
              materials.map((material) => {
                const bought = parseNumber(material.purchaseQty || material.quantity || material.qty);
                const used = parseNumber(material.usedQty || material.used || 0);
                const remaining = bought - used;
                return (
                  <div key={material.id} className="dashboard-box">
                    <h3>📦 {material.name || material.materialName}</h3>
                    <p><strong>Bought:</strong> {bought} {material.unit || ""}</p>
                    <p><strong>Used:</strong> {used} {material.unit || ""}</p>
                    <p><strong>Remaining:</strong> {remaining} {material.unit || ""}</p>
                    <p><strong>Cost:</strong> {formatCurrency(material.cost || material.amount)}</p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "workers" && (
          <div className="dashboard-box">
            <div className="panel-header">
              <div>
                <h2>Assigned Workers</h2>
                <p>{assignedWorkers.length} worker(s)</p>
              </div>
              <button className="add-btn" onClick={() => navigate(`/assign-workers/${id}`)}>👷 Assign Workers</button>
            </div>

            {assignedWorkers.length === 0 ? (
              <p>No workers assigned.</p>
            ) : (
              assignedWorkers.map((worker) => (
                <div key={worker.id || worker.workerId} className="dashboard-box">
                  <h3>👷 {worker.workerName || worker.name}</h3>
                  <p>Role: {worker.role || "Worker"}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="dashboard-box">
            <div className="panel-header">
              <div>
                <h2>Project Expenses</h2>
                <p>Total: {formatCurrency(expenseTotal)}</p>
              </div>
              <button className="add-btn" onClick={() => navigate(`/expenses/${id}`)}>💰 Manage Expenses</button>
            </div>

            {expenses.length === 0 ? (
              <p>No expenses recorded for this project.</p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="dashboard-box">
                  <h3>💰 {expense.title || expense.itemName || "Expense"}</h3>
                  <p><strong>Category:</strong> {expense.category || "General"}</p>
                  <p><strong>Amount:</strong> {formatCurrency(expense.amount || expense.cost)}</p>
                  <p><strong>Date:</strong> {expense.date || "No date"}</p>
                  {expense.note && <p><strong>Note:</strong> {expense.note}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "updates" && (
          <div className="dashboard-box">
            <div className="panel-header">
              <div>
                <h2>Daily Updates</h2>
                <p>{updates.length} update(s)</p>
              </div>
              <button className="add-btn" onClick={() => navigate(`/daily-update/${id}`)}>📝 Add Update</button>
            </div>

            {updates.length === 0 ? (
              <p>No updates yet.</p>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="dashboard-box">
                  <h3>📅 {update.date || "No date"}</h3>
                  <p><strong>Work:</strong> {update.workDone || update.completed || "No work details"}</p>
                  <p><strong>Workers:</strong> {update.workers || "Not added"}</p>
                  <p><strong>Problems:</strong> {update.problems || "None"}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="dashboard-box">
            <h2>📝 Sticky Notes</h2>

            <div className="notes-input-row">
              <input
                placeholder="Write a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="add-btn" onClick={addNote}>Add</button>
            </div>

            <div className="notes-grid">
              {notes.length === 0 ? (
                <p>No notes yet.</p>
              ) : (
                notes.map((item) => (
                  <div key={item.id} className="sticky-note">
                    <p>{item.text}</p>
                    <small>{item.date}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ProjectDetails;
