import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom";


import Splash from "./pages/auth/Splash";

import RoleSelect from "./pages/auth/RoleSelect";

import AdminLogin from "./pages/auth/AdminLogin";

import ClientLogin from "./pages/auth/ClientLogin";


import Dashboard from "./pages/Dashboard";


import Projects from "./pages/admin/Projects";

import ProjectDetails from "./pages/admin/ProjectDetails";

import CreateProject from "./pages/admin/CreateProject";

import DailyUpdate from "./pages/admin/DailyUpdate";
import ClientDashboard from "./pages/client/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Workers from "./pages/admin/Workers";
import Materials from "./pages/admin/Materials";
import Expenses from "./pages/admin/Expenses";
import Reports from "./pages/admin/Reports";




function App(){


return(


<BrowserRouter>


<Routes>


<Route

path="/"

element={<Splash/>}

/>



<Route

path="/role"

element={<RoleSelect/>}

/>



<Route

path="/admin-login"

element={<AdminLogin/>}

/>



<Route

path="/client-login"

element={<ClientLogin/>}

/>



<Route

path="/dashboard"

element={<Dashboard/>}

/>



<Route

path="/projects"

element={

<ProtectedRoute type="admin">

<Projects/>

</ProtectedRoute>

}

/>



<Route

path="/project/:id"

element={

<ProtectedRoute type="admin">

<ProjectDetails/>

</ProtectedRoute>

}

/>

<Route

path="/workers"

element={

<ProtectedRoute type="admin">

<Workers/>

</ProtectedRoute>

}

/>



<Route

path="/materials/:id"

element={

<ProtectedRoute type="admin">

<Materials/>

</ProtectedRoute>

}

/>



<Route

path="/materials"

element={<Materials/>}

/>



<Route

path="/expenses"

element={<Expenses/>}

/>



<Route

path="/expenses/:id"

element={<Expenses/>}

/>



<Route

path="/reports"

element={<Reports/>}

/>



<Route

path="/create-project"

element={

<ProtectedRoute type="admin">

<CreateProject/>

</ProtectedRoute>

}

/>



<Route

path="/daily-update/:id"

element={

<ProtectedRoute type="admin">

<DailyUpdate/>

</ProtectedRoute>

}

/>



<Route

path="/client-dashboard"

element={

<ProtectedRoute type="client">

<ClientDashboard/>

</ProtectedRoute>

}

/>



</Routes>


</BrowserRouter>


)


}



export default App;