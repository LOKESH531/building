import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  FolderKanban,
  IndianRupee,
  Package,
  Plus,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";

import { db } from "../../firebase/firebaseConfig";
import AdminLayout from "../../layouts/AdminLayout";
import GlobalSearch from "../../components/GlobalSearch";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    projects: 0,
    activeProjects: 0,
    workers: 0,
    materials: 0,
    expenses: 0,
    budget: 0,
    updates: 0,
    overallProgress: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [status, setStatus] = useState({
    ongoing: 0,
    completed: 0,
    pending: 0,
  });

  const [recentExpenses, setRecentExpenses] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [activities, setActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const parseNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    const cleaned = String(value).replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (value) => {
    const amount = parseNumber(value);
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const normalizeStatus = (value) => String(value ?? "").trim().toLowerCase();

  const getProjectName = (project) =>
    project.name ?? project.projectName ?? project.title ?? "Untitled Project";

  const getClientName = (project) =>
    project.client ?? project.clientName ?? project.customerName ?? "No client";

  const getBudget = (project) =>
    parseNumber(
      project.budget ??
        project.projectBudget ??
        project.totalBudget ??
        project.estimatedBudget
    );

  const getProgress = (project) =>
    Math.min(
      100,
      Math.max(
        0,
        parseNumber(project.progress ?? project.completion ?? project.percent)
      )
    );

  const getEndDate = (project) =>
    project.endDate ?? project.end ?? project.dueDate ?? project.deadline ?? null;

  const getStartDate = (project) =>
    project.startDate ?? project.start ?? project.createdDate ?? null;

  const getExpenseAmount = (expense) =>
    parseNumber(
      expense.amount ??
        expense.expenseAmount ??
        expense.total ??
        expense.price ??
        expense.cost
    );

  const getExpenseTitle = (expense) =>
    expense.title ?? expense.name ?? expense.category ?? expense.description ?? "Expense";

  const getMaterialQty = (material) =>
    parseNumber(material.quantity ?? material.qty ?? material.stock);

  const getMaterialName = (material) =>
    material.name ?? material.materialName ?? material.item ?? "Material";

  const formatDateValue = (value) => {
    if (!value) return "";

    if (typeof value === "string") return value;

    if (value?.seconds) {
      return new Date(value.seconds * 1000).toLocaleDateString("en-IN");
    }

    if (value instanceof Date) {
      return value.toLocaleDateString("en-IN");
    }

    return String(value);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        projectSnap,
        workerSnap,
        materialSnap,
        expenseSnap,
        updateSnap,
        activitySnap,
      ] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "workers")),
        getDocs(collection(db, "materials")),
        getDocs(collection(db, "expenses")),
        getDocs(collection(db, "dailyUpdates")),
        getDocs(collection(db, "activities")),
      ]);

      const projects = projectSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      const expenses = expenseSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      const materials = materialSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      const acts = activitySnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      let totalBudget = 0;
      let totalExpense = 0;
      let progressTotal = 0;

      let ongoing = 0;
      let completed = 0;
      let pending = 0;

      projects.forEach((project) => {
        totalBudget += getBudget(project);
        progressTotal += getProgress(project);

        const projectStatus = normalizeStatus(
          project.status ?? project.projectStatus ?? project.state
        );

        if (["completed", "complete", "done"].includes(projectStatus)) {
          completed += 1;
        } else if (
          ["ongoing", "on going", "running", "active", "in progress"].includes(
            projectStatus
          )
        ) {
          ongoing += 1;
        } else {
          pending += 1;
        }
      });

      expenses.forEach((expense) => {
        totalExpense += getExpenseAmount(expense);
      });

      const workerCount =
        workerSnap.size ||
        projects.reduce(
          (total, project) =>
            total + parseNumber(project.workerCount ?? project.workers),
          0
        );

      setStatus({ ongoing, completed, pending });

      setStats({
        projects: projects.length,
        activeProjects: ongoing,
        workers: workerCount,
        materials: materialSnap.size,
        expenses: totalExpense,
        budget: totalBudget,
        updates: updateSnap.size,
        overallProgress: projects.length
          ? Math.round(progressTotal / projects.length)
          : 0,
      });

      setRecentProjects(
        projects
          .map((project) => ({
            ...project,
            _name: getProjectName(project),
            _client: getClientName(project),
            _budget: getBudget(project),
            _status:
              project.status ?? project.projectStatus ?? project.state ?? "Pending",
            _progress: getProgress(project),
            _startDate: getStartDate(project),
            _endDate: getEndDate(project),
          }))
          .slice(0, 5)
      );

      setRecentExpenses(
        expenses
          .map((expense) => ({
            ...expense,
            _amount: getExpenseAmount(expense),
            _title: getExpenseTitle(expense),
          }))
          .sort((a, b) => b._amount - a._amount)
          .slice(0, 5)
      );

      setLowStock(
        materials
          .map((material) => ({
            ...material,
            _qty: getMaterialQty(material),
            _name: getMaterialName(material),
          }))
          .filter((material) => material._qty < 10)
          .slice(0, 5)
      );

      const today = new Date();

      setUpcomingDeadlines(
        projects
          .filter((project) => getEndDate(project))
          .map((project) => {
            const due = new Date(getEndDate(project));
            const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

            return { ...project, _name: getProjectName(project), daysLeft };
          })
          .filter(
            (project) =>
              normalizeStatus(project.status) !== "completed" &&
              project.daysLeft <= 7
          )
          .sort((a, b) => a.daysLeft - b.daysLeft)
          .slice(0, 5)
      );

      setActivities(acts.slice(-5).reverse());
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const remainingBudget = stats.budget - stats.expenses;

  const budgetUsedPercent =
    stats.budget > 0 ? Math.min(100, (stats.expenses / stats.budget) * 100) : 0;

  const health = useMemo(() => {
    if (stats.budget > 0 && stats.expenses > stats.budget) {
      return { label: "Over Budget", className: "danger" };
    }

    if (stats.budget > 0 && stats.expenses > stats.budget * 0.8) {
      return { label: "At Risk", className: "warning" };
    }

    return { label: "Healthy", className: "success" };
  }, [stats.budget, stats.expenses]);

  const firstProjectId = recentProjects[0]?.id;

  const quickActions = [
    {
      label: "New Project",
      icon: Plus,
      action: () => navigate("/create-project"),
    },
    {
      label: "Daily Update",
      icon: CalendarClock,
      action: () =>
        navigate(firstProjectId ? `/daily-update/${firstProjectId}` : "/projects"),
    },
    {
      label: "Add Worker",
      icon: UserPlus,
      action: () => navigate("/workers"),
    },
    {
      label: "Add Expense",
      icon: IndianRupee,
      action: () => navigate("/expenses"),
    },
    {
      label: "Generate Report",
      icon: BarChart3,
      action: () => navigate("/reports"),
    },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <p className="page-kicker">Admin Dashboard</p>
            <h1>Dashboard</h1>
            <span>
              Track projects, workers, expenses, materials, and updates in one
              place.
            </span>
          </div>

          <button
            className="secondary-btn"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <GlobalSearch />

        {error && <div className="error-banner">{error}</div>}

        <section className="summary-grid">
          <StatCard
            icon={FolderKanban}
            title="Active Projects"
            value={stats.activeProjects}
            note={`${stats.projects} total projects`}
          />

          <StatCard
            icon={BarChart3}
            title="Overall Progress"
            value={`${stats.overallProgress}%`}
            note="All projects average"
          />

          <StatCard
            icon={Users}
            title="Workers"
            value={stats.workers}
            note="Total workers"
          />

          <StatCard
            icon={Package}
            title="Materials"
            value={stats.materials}
            note={`${lowStock.length} low stock`}
          />

          <StatCard
            icon={IndianRupee}
            title="Total Expenses"
            value={formatCurrency(stats.expenses)}
            note={`Budget ${formatCurrency(stats.budget)}`}
          />
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-panel recent-projects-panel">
            <div className="panel-header">
              <div>
                <h2>Recent Projects</h2>
                <p>Latest project progress and status.</p>
              </div>

              <button className="text-btn" onClick={() => navigate("/projects")}>
                View all <ArrowRight size={15} />
              </button>
            </div>

            {loading ? (
              <p className="muted-text">Loading projects...</p>
            ) : recentProjects.length === 0 ? (
              <div className="empty-state">
                <FolderKanban size={34} />
                <p>No projects available yet.</p>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/create-project")}
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="project-list-clean">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    className="project-row-clean"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="project-thumb">🏗</div>

                    <div className="project-row-body">
                      <div className="project-row-top">
                        <div>
                          <h3>{project._name}</h3>
                          <span>{project._client}</span>
                        </div>

                        <span
                          className={`status-pill ${normalizeStatus(
                            project._status
                          ).replace(/\s+/g, "-")}`}
                        >
                          {project._status || "Pending"}
                        </span>
                      </div>

                      <div className="mini-progress-row">
                        <div className="mini-progress">
                          <span style={{ width: `${project._progress}%` }} />
                        </div>
                        <strong>{project._progress}%</strong>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-panel quick-panel">
            <div className="panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Common admin actions.</p>
              </div>
            </div>

            <div className="quick-action-list">
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    className="quick-action"
                    onClick={item.action}
                  >
                    <span>
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="status-grid">
          <SmallStatus title="Ongoing" value={status.ongoing} icon="🟢" />
          <SmallStatus title="Completed" value={status.completed} icon="✅" />
          <SmallStatus title="Pending" value={status.pending} icon="⏳" />

          <SmallStatus
            title="Remaining Budget"
            value={formatCurrency(remainingBudget)}
            icon="💵"
          />

          <SmallStatus title="Updates" value={stats.updates} icon="📝" />

          <SmallStatus
            title="Project Health"
            value={health.label}
            icon="●"
            health={health.className}
          />
        </section>

        <section className="dashboard-bottom-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Budget Utilization</h2>
                <p>{budgetUsedPercent.toFixed(1)}% of total budget used.</p>
              </div>
            </div>

            <div className="budget-numbers">
              <span>Used: {formatCurrency(stats.expenses)}</span>
              <span>Budget: {formatCurrency(stats.budget)}</span>
            </div>

            <div className="large-progress">
              <span style={{ width: `${budgetUsedPercent}%` }} />
            </div>
          </div>

          <InfoList
            title="Alerts"
            emptyText="No urgent alerts"
            items={[
              ...upcomingDeadlines.map((project) => ({
                id: `deadline-${project.id}`,
                title: project._name,
                meta:
                  project.daysLeft < 0
                    ? `Delayed by ${Math.abs(project.daysLeft)} days`
                    : project.daysLeft === 0
                    ? "Due today"
                    : `${project.daysLeft} day(s) left`,
                type: project.daysLeft < 0 ? "danger" : "warning",
              })),
              ...lowStock.map((material) => ({
                id: `stock-${material.id}`,
                title: material._name,
                meta: `Only ${material._qty} left`,
                type: "warning",
              })),
            ].slice(0, 5)}
          />

          <InfoList
            title="Recent Expenses"
            emptyText="No expenses added"
            items={recentExpenses.map((expense) => ({
              id: expense.id,
              title: expense._title,
              meta: formatCurrency(expense._amount),
              type: "success",
            }))}
          />

          <InfoList
            title="Recent Activities"
            emptyText="No recent activity"
            items={activities.map((activity) => ({
              id: activity.id,
              title:
                activity.title ||
                activity.name ||
                activity.type ||
                "Activity",
              meta: formatDateValue(activity.date || activity.createdAt),
              type: "neutral",
            }))}
          />
        </section>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, title, value, note }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={21} />
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{note}</span>
      </div>
    </div>
  );
}

function SmallStatus({ title, value, icon, health }) {
  return (
    <div className="small-status-card">
      <span className={health ? `health-dot ${health}` : ""}>{icon}</span>

      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

function InfoList({ title, items, emptyText }) {
  return (
    <div className="dashboard-panel info-list-panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="muted-text">{emptyText}</p>
      ) : (
        <div className="info-list">
          {items.map((item) => (
            <div key={item.id} className="info-item">
              <span className={`info-dot ${item.type}`} />

              <div>
                <h4>{item.title}</h4>
                {item.meta && <p>{item.meta}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
