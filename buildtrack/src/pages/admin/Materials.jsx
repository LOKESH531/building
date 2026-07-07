import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import AdminLayout from "../../layouts/AdminLayout";

function Materials() {
  const { id } = useParams();

  const materialOptions = [
    "Cement", "Steel", "Sand", "Bricks", "Aggregate", "Paint", "Tiles",
    "Wood", "Electrical Items", "Plumbing Items", "Glass", "Doors", "Windows", "Other",
  ];

  const unitOptions = [
    "Bags", "Kg", "Tons", "Cft", "Pieces", "Litres", "Boxes", "Bundles", "Other",
  ];

  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState(id || "");
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [purchaseQty, setPurchaseQty] = useState("");
  const [usedQty, setUsedQty] = useState("");
  const [unit, setUnit] = useState("Bags");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  useEffect(() => {
    if (id) setSelectedProjectId(id);
  }, [id]);

  useEffect(() => { loadMaterials(); }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const snap = await getDocs(collection(db, "projects"));
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Projects load failed:", error);
      alert(error.message);
    }
  };

  const loadMaterials = async () => {
    try {
      const snap = await getDocs(collection(db, "materials"));
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(selectedProjectId ? list.filter((i) => i.projectId === selectedProjectId) : []);
    } catch (error) {
      console.error("Materials load failed:", error);
      alert(error.message);
    }
  };

  const getSelectedProject = () => projects.find((p) => p.id === selectedProjectId);

  const addMaterial = async () => {
    if (!selectedProjectId) { alert("Please select project"); return; }

    const finalName = name === "Other" ? customName.trim() : name;
    if (!finalName || !purchaseQty || !cost) {
      alert("Please fill material, purchase quantity and cost");
      return;
    }

    try {
      setLoading(true);
      const selectedProject = getSelectedProject();

      await addDoc(collection(db, "materials"), {
        projectId: selectedProjectId,
        projectName: selectedProject?.name || selectedProject?.projectName || "",
        name: finalName,
        materialName: finalName,
        purchaseQty: Number(purchaseQty) || 0,
        quantity: Number(purchaseQty) || 0,
        usedQty: Number(usedQty) || 0,
        unit,
        cost: Number(cost) || 0,
        amount: Number(cost) || 0,
        createdAt: serverTimestamp(),
      });

      setName(""); setCustomName(""); setPurchaseQty(""); setUsedQty(""); setUnit("Bags"); setCost("");
      loadMaterials();
      alert("Material added successfully");
    } catch (error) {
      console.error("Material add failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = items.reduce((sum, item) => sum + Number(item.cost || item.amount || 0), 0);

  return (
    <AdminLayout>
      <h1>Materials</h1>

      <div className="form-box">
        <h2>Add Project Material</h2>

        <label>Select Project</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name || p.projectName || "Untitled Project"}</option>
          ))}
        </select>

        <label>Material Type</label>
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option value="">Select Material</option>
          {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {name === "Other" && (
          <input placeholder="Enter Material Name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
        )}

        <input placeholder="Purchase Quantity" type="number" value={purchaseQty} onChange={(e) => setPurchaseQty(e.target.value)} />
        <input placeholder="Used Quantity" type="number" value={usedQty} onChange={(e) => setUsedQty(e.target.value)} />

        <label>Unit</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>

        <input placeholder="Total Cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />

        <button className="add-btn" onClick={addMaterial} disabled={loading}>
          {loading ? "Adding..." : "Add Material"}
        </button>
      </div>

      <div className="dashboard-box">
        <h2>Project Material Stock</h2>

        {!selectedProjectId && <p>Please select a project to view materials.</p>}
        {selectedProjectId && items.length === 0 && <h3>No Materials Added</h3>}

        {selectedProjectId && items.length > 0 && (
          <>
            <h3>Total Material Cost: ₹{totalCost.toLocaleString("en-IN")}</h3>

            {items.map((item) => {
              const bought = Number(item.purchaseQty || item.quantity || 0);
              const used = Number(item.usedQty || 0);
              const remaining = bought - used;

              return (
                <div key={item.id} className="dashboard-box">
                  <h3>📦 {item.name || item.materialName}</h3>
                  <p>Project: {item.projectName || "Selected Project"}</p>
                  <p>Bought: {bought} {item.unit}</p>
                  <p>Used: {used} {item.unit}</p>
                  <p>Remaining: {remaining} {item.unit}</p>
                  <p>Cost: ₹{Number(item.cost || 0).toLocaleString("en-IN")}</p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default Materials;
