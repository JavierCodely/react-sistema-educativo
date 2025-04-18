
import "./App.css";
import Login from "./pages/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRoute";
import StudentDashboard from "./pages/alumno/StudentDashboard";
function App() {
 

  return (
    <>
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route
            path="/alumno/StudentDashboard"
            element={<ProtectedRoute allowedRoles={["alumno"]}>
              <StudentDashboard />
            </ProtectedRoute>}
          />
        </Routes>
      
    </>
  );
}

export default App;
