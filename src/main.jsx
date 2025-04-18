import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRoute.tsx";
import "./index.css";
import App from "./App.jsx";
import StudentDashboard from "./pages/alumno/StudentDashboard.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login/*" element={<App />} />
          <Route
            path="/alumno/StudentDashboard"
            element={
              <ProtectedRoute allowedRoles={["alumno"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
