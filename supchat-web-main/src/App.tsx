import { routes } from "./constants/variables";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import WorkspacesPage from "./pages/workspaces";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import ProtectedRoutes from "./component/protectedRoutes";
import DosProtection from "./component/DosProtection";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
          path={routes.dashboard}
        />
        <Route
          element={
            <ProtectedRoutes>
              <WorkspacesPage />
            </ProtectedRoutes>
          }
          path={routes.workspaces}
        />

        <Route
          element={
            <DosProtection>
              <Login />
            </DosProtection>
          }
          path={routes.login}
        />
        <Route
          element={
            <DosProtection>
              <SignUp />
            </DosProtection>
          }
          path={routes.signup}
        />
      </Routes>
    </Router>
  );
}

export default App;
