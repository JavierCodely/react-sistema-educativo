// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeFill, LockFill } from "react-bootstrap-icons";
import "../../styles/Login.css";
import { useAuth } from "../../contexts/authContext";
import { supabase } from "../../services/auth/supabase/supabaseClient";

/**
 * Componente de inicio de sesión
 *
 * Este componente permite a los usuarios autenticarse en el sistema.
 */
const Login = () => {
  const navigate = useNavigate();
  const [formValidated, setFormValidated] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const { login } = useAuth(); // obtenemos la función login del contexto

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario de inicio de sesión
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormValidated(true);
    setError("");
    setSuccessMessage("");
    setDebugInfo(null);
  
    if (!loginData.email || !loginData.password) {
      setError("Por favor completa todos los campos");
      return;
    }
  
    if (!loginData.email.endsWith("@its.edu.ar")) {
      setError("Solo se permite correo institucional (@its.edu.ar)");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
  
      // Guardar información de autenticación para debug
      setDebugInfo({ 
        authStatus: error ? "error" : "success",
        authData: data ? { user: data.user ? { id: data.user.id, email: data.user.email } : null } : null,
        authError: error,
        step: "auth"
      });
  
      if (error || !data.user) {
        throw new Error("Credenciales inválidas. Por favor verifica tu correo y contraseña.");
      }
  
      // 2. Obtener el perfil desde la tabla 'usuario'
      const { data: profileData, error: profileError } = await supabase
        .from("usuario")
        .select("dni, nombre, rol")
        .eq("id", data.user.id)
        .single();
  
      // Actualizar información de debug
      setDebugInfo(prevDebug => ({
        ...prevDebug,
        profileStatus: profileError ? "error" : "success",
        profileData: profileData ? { 
          dni: profileData.dni,
          name: profileData.nombre,
          role: profileData.rol
        } : null,
        profileError,
        step: "profile"
      }));
  
      if (profileError) {
        // Si hay un error específico, mostramos un mensaje personalizado
        if (profileError.code === "PGRST116") { // Código para "not found"
          throw new Error("No se encontró tu perfil. Por favor comunícate con un preceptor para verificar tu cuenta.");
        } else {
          throw new Error(`Error al acceder a tu perfil: ${profileError.message}`);
        }
      }
  
      if (!profileData) {
        throw new Error("Tu perfil de usuario está incompleto. Por favor comunícate con un preceptor.");
      }
  
      // 3. Construir objeto de usuario para el contexto
      const user = {
        dni: profileData.dni,
        name: profileData.nombre,
        email: loginData.email,
        role: profileData.rol
      };
  
      // 4. Login exitoso - actualizar el contexto
      login(user);  
      setSuccessMessage("Inicio de sesión exitoso");
      
      // 5. Actualizar debug final
      setDebugInfo(prevDebug => ({
        ...prevDebug,
        loginStatus: "success",
        user,
        step: "final"
      }));
      
      // 6. Redirigir según el rol
      setTimeout(() => {
        navigate(`/${profileData.rol}/StudentDashboard`);
      }, 1000);
     
    } catch (err) {
      // Actualizar información de debug con el error final
      setDebugInfo(prevDebug => ({
        ...prevDebug,
        finalError: err.message,
        step: "error"
      }));
      
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Iniciar Sesión</h2>
            <p>Accede a tu cuenta en el sistema académico</p>
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="auth-alert error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success">
              <i className="bi bi-check-circle-fill"></i>
              {successMessage}
            </div>
          )}

          {/* Formulario de login */}
          <form
            onSubmit={handleSubmit}
            className={`auth-form ${formValidated ? "was-validated" : ""}`}
          >
           
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <EnvelopeFill className="icon" /> Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                placeholder="tu@its.edu.ar"
                required
              />
              <div className="invalid-feedback">
                El correo electrónico es obligatorio
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <LockFill className="icon" /> Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              <div className="invalid-feedback">
                La contraseña es obligatoria
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Ingresar"}
            </button>

            <div className="auth-links">
              <Link to="/activar-cuenta">¿Primera vez? Activar mi cuenta</Link>
              <Link to="/recuperar-password">Olvidé mi contraseña</Link>
            </div>
          </form>
          
          {/* Información de debug - Solo visible en desarrollo */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="debug-info">
              <h4>Información de Debug</h4>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;