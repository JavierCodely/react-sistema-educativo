import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentDashboard from "./pages/alumno/StudentDashboard";
import ProtectedRoute from "./routes/protectedRoute";
import NotificacionesPage from "./pages/notificaciones/NotificacionesPage";
import { NotificacionesProvider } from "./contexts/NotificacionesContext";


function App() {
  return (
    <NotificacionesProvider>
      <Routes>
        {/* Redirige la ruta base al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de autenticación */}
        <Route path="/login/*" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/alumno/StudentDashboard"
          element={
            <ProtectedRoute allowedRoles={["alumno"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/notificaciones" element={<NotificacionesPage />} />

        {/* Captura cualquier otra ruta y redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </NotificacionesProvider>
  );
}

export default App;
