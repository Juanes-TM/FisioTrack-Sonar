import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PacienteDashboard from "./pages/dashboard/PacienteDashboard";
import FisioDashboard from "./pages/dashboard/FisioDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Páginas privadas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Ruta por defecto dentro del dashboard */}
        <Route index element={<PacienteDashboard />} />
        <Route path="paciente" element={<PacienteDashboard />} />
        <Route path="fisio" element={<FisioDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;
