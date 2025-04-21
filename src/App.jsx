import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentDashboard from "./pages/alumno/StudentDashboard";
import ProtectedRoute from "./routes/protectedRoute";

function App() {
  return (
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
      
      {/* Captura cualquier otra ruta y redirige al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;