import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import AdminLayout from "../../layouts/AdminLayout";

function Expenses() {
  const { id } = useParams();

  const expenseCategories = [
    "Material", "Labour", "Transport", "Equipment", "Electricity",
    "Water", "Permit", "Advance Payment", "Other",
  ];

  const expenseItems = {
    Material: ["Cement", "Steel", "Sand", "Bricks", "Aggregate", "Paint", "Tiles", "Wood", "Electrical Items", "Plumbing Items", "Other"],
    Labour: ["Mason Labour", "Helper Labour", "Carpenter", "Electrician", "Plumber", "Painter", "Supervisor", "Other"],
    Transport: ["Truck Rent", "Fuel", "Material Delivery", "Labour Transport", "Other"],
    Equipment: ["Concrete Mixer", "Scaffolding", "Drilling Machine", "JCB", "Crane", "Other"],
    Electricity: ["Electricity Bill", "Temporary Connection", "Other"],
    Water: ["Water Tanker", "Water Bill", "Other"],
    Permit: ["Building Permit", "Approval Fee", "Other"],
    "Advance Payment": ["Contractor Advance", "Labour Advance", "Supplier Advance", "Other"],
    Other: ["Other"],
  };

  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState(id || "");
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  useEffect(() => {
    if (id) setSelectedProjectId(id);
  }, [id]);

  useEffect(() => { loadExpenses(); }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const snap = await getDocs(collection(db, "projects"));
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Projects load failed:", error);
      alert(error.message);
    }
  };

  const loadExpenses = async () => {
    try {
      const snap = await getDocs(collection(db, "expenses"));
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setExpenses(selectedProjectId ? list.filter((e) => e.projectId === selectedProjectId) : []);
    } catch (error) {
      console.error("Expenses load failed:", error);
      alert(error.message);
    }
  };

  const getSelectedProject = () => projects.find((p) => p.id === selectedProjectId);

  const handleCategoryChange = (value) => {
    setCategory(value);
    setItemName("");
    setCustomItem("");
  };

  const addExpense = async () => {
    if (!selectedProjectId) { alert("Please select project"); return; }
    if (!category) { alert("Please select expense category"); return; }

    const finalItemName = itemName === "Other" ? customItem.trim() : itemName;
    if (!finalItemName || !amount) {
      alert("Please fill expense item and amount");
      return;
    }

    try {
      setLoading(true);
      const selectedProject = getSelectedProject();

      await addDoc(collection(db, "expenses"), {
        projectId: selectedProjectId,
        projectName: selectedProject?.name || selectedProject?.projectName || "",
        category,
        title: finalItemName,
        itemName: finalItemName,
        amount: Number(amount) || 0,
        date: expenseDate,
        note,
        createdAt: serverTimestamp(),
      });

      setCategory(""); setItemName(""); setCustomItem(""); setAmount(""); setNote("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      loadExpenses();
      alert("Expense added successfully");
    } catch (error) {
      console.error("Expense add failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const currentItemOptions = category ? expenseItems[category] || [] : [];

  return (
    <AdminLayout>
      <h1>Expenses</h1>

      <div className="form-box">
        <h2>Add Project Expense</h2>

        <label>Select Project</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name || p.projectName || "Untitled Project"}</option>
          ))}
        </select>

        <label>Expense Category</label>
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Select Category</option>
          {expenseCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <label>Expense Item</label>
        <select value={itemName} onChange={(e) => setItemName(e.target.value)} disabled={!category}>
          <option value="">Select Item</option>
          {currentItemOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        {itemName === "Other" && (
          <input placeholder="Enter Expense Item" value={customItem} onChange={(e) => setCustomItem(e.target.value)} />
        )}

        <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label>Expense Date</label>
        <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />

        <textarea placeholder="Note / Description" value={note} onChange={(e) => setNote(e.target.value)} />

        <button className="add-btn" onClick={addExpense} disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>

      <div className="dashboard-box">
        <h2>Project Expense History</h2>

        {!selectedProjectId && <p>Please select a project to view expenses.</p>}
        {selectedProjectId && expenses.length === 0 && <h3>No Expenses Added</h3>}

        {selectedProjectId && expenses.length > 0 && (
          <>
            <h3>Total Expense: ₹{totalExpense.toLocaleString("en-IN")}</h3>

            {expenses.map((expense) => (
              <div key={expense.id} className="dashboard-box">
                <h3>💰 {expense.title || expense.itemName}</h3>
                <p>Project: {expense.projectName || "Selected Project"}</p>
                <p>Category: {expense.category}</p>
                <p>Amount: ₹{Number(expense.amount || 0).toLocaleString("en-IN")}</p>
                <p>Date: {expense.date}</p>
                {expense.note && <p>Note: {expense.note}</p>}
              </div>
            ))}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default Expenses;
