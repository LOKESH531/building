import {BrowserRouter,Routes,Route} from "react-router-dom";

import Splash from "./pages/auth/Splash";
import RoleSelect from "./pages/auth/RoleSelect";
import Login from "./pages/auth/Login";
import OwnerSignup from "./pages/auth/OwnerSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import ProjectDetails from "./pages/admin/ProjectDetails";
import CreateProject from "./pages/admin/CreateProject";
import DailyUpdate from "./pages/admin/DailyUpdate";
import EditProject from "./pages/admin/EditProject";
import AssignWorkers from "./pages/admin/AssignWorkers";
import Workers from "./pages/admin/Workers";
import Materials from "./pages/admin/Materials";
import Expenses from "./pages/admin/Expenses";
import Reports from "./pages/admin/Reports";

import Users from "./pages/owner/Users";

import ClientDashboard from "./pages/client/ClientDashboard";
import ClientUpdates from "./pages/client/ClientUpdates";
import ClientExpenses from "./pages/client/ClientExpenses";
import ClientProgress from "./pages/client/ClientProgress";
import ClientDocuments from "./pages/client/ClientDocuments";

import ProtectedRoute from "./routes/ProtectedRoute";
import FirstCompanyGuard from "./components/FirstCompanyGuard";

const ADMIN_ROLES = ["owner", "admin"];
const CLIENT_ROLES = ["client"];

function App(){
  return(
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Splash/>}/>
        <Route path="/role" element={<RoleSelect/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup-owner" element={<FirstCompanyGuard><OwnerSignup/></FirstCompanyGuard>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>

        {/* Admin / Owner Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Dashboard/></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Dashboard/></ProtectedRoute>}/>
        <Route path="/owner" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Dashboard/></ProtectedRoute>}/>
        <Route path="/projects" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Projects/></ProtectedRoute>}/>
        <Route path="/project/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><ProjectDetails/></ProtectedRoute>}/>
        <Route path="/project-details/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><ProjectDetails/></ProtectedRoute>}/>
        <Route path="/create-project" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><CreateProject/></ProtectedRoute>}/>
        <Route path="/edit-project/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><EditProject/></ProtectedRoute>}/>
        <Route path="/daily-update/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><DailyUpdate/></ProtectedRoute>}/>
        <Route path="/assign-workers/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><AssignWorkers/></ProtectedRoute>}/>
        <Route path="/workers" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Workers/></ProtectedRoute>}/>
        <Route path="/materials/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Materials/></ProtectedRoute>}/>
        <Route path="/materials" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Materials/></ProtectedRoute>}/>
        <Route path="/expenses" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Expenses/></ProtectedRoute>}/>
        <Route path="/expenses/:id" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Expenses/></ProtectedRoute>}/>
        <Route path="/reports" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Reports/></ProtectedRoute>}/>
        <Route path="/users" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Users/></ProtectedRoute>}/>

        {/* Client Routes */}
        <Route path="/client" element={<ProtectedRoute allowedRoles={CLIENT_ROLES}><ClientDashboard/></ProtectedRoute>}/>
        <Route path="/client-dashboard" element={<ProtectedRoute allowedRoles={CLIENT_ROLES}><ClientDashboard/></ProtectedRoute>}/>
        <Route path="/client-updates" element={<ProtectedRoute allowedRoles={CLIENT_ROLES}><ClientUpdates/></ProtectedRoute>}/>
        <Route path="/client-expenses" element={<ProtectedRoute allowedRoles={CLIENT_ROLES}><ClientExpenses/></ProtectedRoute>}/>
        <Route path="/client-progress" element={<ProtectedRoute allowedRoles={CLIENT_ROLES}><ClientProgress/></ProtectedRoute>}/>
        <Route path="/client-documents" element={<ProtectedRoute allowedRoles={CLIENT_ROLES}><ClientDocuments/></ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
