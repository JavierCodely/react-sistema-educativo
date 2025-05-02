import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ActivarCuenta from "./pages/auth/ActivarCuenta";
import EstablecerPassword from "./pages/auth/EstablecerPassword";
import RecuperarPassword from "./pages/auth/RecuperarPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentDashboard from "./pages/alumno/StudentDashboard";
import CrearUsuarios from "./pages/preceptor/CrearUsuarios";
import ProtectedRoute from "./routes/protectedRoute";
import NotificacionesPage from "./pages/notificaciones/NotificacionesPage";
import { NotificacionesProvider } from "./contexts/NotificacionesContext";
import { AuthProvider } from "./contexts/authContext";
import TestSupabaseEmail from "./pages/auth/testSupabase";
function App() {
  return (
    <AuthProvider>
      <NotificacionesProvider>
        <Routes>
          <Route path="/test-email" element={<TestSupabaseEmail />} />
          {/* Redirige la ruta base al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/activar-cuenta" element={<ActivarCuenta />} />
          <Route path="/establecer-password" element={<EstablecerPassword />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />

          {/* Rutas protegidas para alumnos */}
          <Route
            path="/alumno/StudentDashboard"
            element={
              <ProtectedRoute allowedRoles={["alumno"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para profesores */}
          <Route
            path="/profesor/*"
            element={
              <ProtectedRoute allowedRoles={["profesor"]}>
                {/* Aquí irán las rutas específicas de profesores */}
                <div>Panel de profesor</div>
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para preceptores */}
          <Route
            path="/preceptor/*"
            element={
              <ProtectedRoute allowedRoles={["preceptor"]}>
                <Routes>
                  <Route
                    path="dashboard"
                    element={<div>Panel de preceptor</div>}
                  />
                  <Route path="crear-usuarios" element={<CrearUsuarios />} />
                  <Route
                    path="*"
                    element={<Navigate to="dashboard" replace />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Rutas para notificaciones (para todos los roles) */}
          <Route
            path="/notificaciones"
            element={
              <ProtectedRoute
                allowedRoles={["alumno", "profesor", "preceptor"]}
              >
                <NotificacionesPage />
              </ProtectedRoute>
            }
          />

          {/* Captura cualquier otra ruta y redirige al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </NotificacionesProvider>
    </AuthProvider>
  );
}

export default App;
