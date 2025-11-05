// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterTeam from "./pages/RegisterTeam";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterTeam />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas dentro del panel */}
        <Route
          element={
            <ProtectedRoute roles={["Delegado", "Admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores" element={<Dashboard />} />
          <Route path="/ligas" element={<Dashboard />} />
          <Route path="/pagos" element={<Dashboard />} />
          <Route path="/credenciales" element={<Dashboard />} />
          <Route path="/reportes" element={<Dashboard />} />
          <Route path="/comunicaciones" element={<Dashboard />} />
          <Route path="/configuracion" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
