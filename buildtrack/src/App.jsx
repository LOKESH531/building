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

import ClientDashboard from "./pages/client/ClientDashboard";

import ClientUpdates from "./pages/client/ClientUpdates";

import ClientExpenses from "./pages/client/ClientExpenses";

import ClientProgress from "./pages/client/ClientProgress";

import ClientDocuments from "./pages/client/ClientDocuments";

import AdminRoute from "./routes/AdminRoute";

import ClientRoute from "./routes/ClientRoute";




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

element={

<AdminRoute>

<Dashboard/>

</AdminRoute>

}

/>



<Route

path="/projects"

element={

<AdminRoute>

<Projects/>

</AdminRoute>

}

/>



<Route

path="/project/:id"

element={

<AdminRoute>

<ProjectDetails/>

</AdminRoute>

}

/>



<Route

path="/create-project"

element={

<AdminRoute>

<CreateProject/>

</AdminRoute>

}

/>



<Route

path="/edit-project/:id"

element={

<AdminRoute>

<EditProject/>

</AdminRoute>

}

/>



<Route

path="/daily-update/:id"

element={

<AdminRoute>

<DailyUpdate/>

</AdminRoute>

}

/>



<Route

path="/assign-workers/:id"

element={

<AdminRoute>

<AssignWorkers/>

</AdminRoute>

}

/>



<Route

path="/workers"

element={

<AdminRoute>

<Workers/>

</AdminRoute>

}

/>



<Route

path="/materials/:id"

element={

<AdminRoute>

<Materials/>

</AdminRoute>

}

/>



<Route

path="/materials"

element={

<AdminRoute>

<Materials/>

</AdminRoute>

}

/>



<Route

path="/expenses"

element={

<AdminRoute>

<Expenses/>

</AdminRoute>

}

/>



<Route

path="/expenses/:id"

element={

<AdminRoute>

<Expenses/>

</AdminRoute>

}

/>



<Route

path="/reports"

element={

<AdminRoute>

<Reports/>

</AdminRoute>

}

/>



<Route

path="/client-dashboard"

element={

<ClientRoute>

<ClientDashboard/>

</ClientRoute>

}

/>



<Route

path="/client-updates"

element={

<ClientRoute>

<ClientUpdates/>

</ClientRoute>

}

/>



<Route

path="/client-expenses"

element={

<ClientRoute>

<ClientExpenses/>

</ClientRoute>

}

/>



<Route

path="/client-progress"

element={

<ClientRoute>

<ClientProgress/>

</ClientRoute>

}

/>



<Route

path="/client-documents"

element={

<ClientRoute>

<ClientDocuments/>

</ClientRoute>

}

/>


</Routes>


</BrowserRouter>


)


}



export default App;
