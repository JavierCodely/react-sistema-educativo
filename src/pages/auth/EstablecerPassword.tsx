// src/pages/auth/EstablecerPassword.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/auth/supabase/supabaseClient";
import "../../styles/Login.css";

export default function EstablecerPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token válido en la URL (enviado por Supabase)
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");

    const validateSession = async () => {
      if (access_token && refresh_token) {
        try {
          // Establecer la sesión con el token recibido
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("Error al establecer sesión:", error);
            setTokenValid(false);
            setMensaje("Token inválido o expirado");
            setDebugInfo({ error, action: "setSession" });
            return;
          }

          // Guardar el ID del usuario
          if (data.user) {
            setUserId(data.user.id);
            
            // Verificar si el usuario tiene un perfil
            const { data: profileData, error: profileError } = await supabase
              .from("usuario")
              .select("id, name, role, dni")
              .eq("id", data.user.id)
              .single();
              
            // Guardar información de debug
            setDebugInfo({ 
              user: data.user,
              profileData,
              profileError,
              action: "checkProfile"
            });
            
            if (profileError) {
              console.warn("Error al verificar perfil:", profileError);
              // No invalidamos el token aquí, permitimos establecer la contraseña de todos modos
            }

            // Si no tiene perfil, mostramos una advertencia pero seguimos
            if (!profileData) {
              console.warn("Advertencia: El usuario no tiene un perfil asociado");
              setMensaje("Aviso: Tu perfil podría no estar completamente configurado. Contacta a un preceptor después de establecer tu contraseña.");
            }
          }
        } catch (err) {
          console.error("Error al validar sesión:", err);
          setTokenValid(false);
          setMensaje("Error al validar la sesión");
          setDebugInfo({ error: err, action: "validateSession" });
        }
      } else {
        setTokenValid(false);
        setMensaje("Faltan credenciales para establecer la sesión");
        setDebugInfo({ error: "No tokens", action: "checkTokens" });
      }
    };

    validateSession();
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setSuccess(false);

    // Verificar si hay un usuario válido en la sesión
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setTokenValid(false);
      setMensaje("Sesión no válida");
      setDebugInfo({ error: "No user in session", action: "getUser" });
      return;
    }

    // Validaciones
    if (password.length < 8) {
      setMensaje("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar la contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      setDebugInfo({
        updatePasswordResult: updateError ? "error" : "success",
        updatePasswordError: updateError,
        action: "updatePassword"
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Verificar si el usuario tiene un perfil en la base de datos
      const { data: profileData, error: profileError } = await supabase
        .from("usuario")
        .select("id, name, role, dni")
        .eq("id", user.id)
        .single();

      // Añadir a debug info
      setDebugInfo(prevDebug => ({
        ...prevDebug,
        profileCheckResult: profileError ? "error" : "success",
        profileData,
        profileError,
        action: "checkProfileAfterUpdate"
      }));

      if (profileError) {
        console.warn("Posible problema con el perfil:", profileError);
      }

      // Si el perfil no existe, enviamos un mensaje pero no bloqueamos
      // Esto permite a los usuarios establecer la contraseña incluso si hay problemas con el perfil
      if (!profileData) {
        console.warn("No se encontró un perfil para el usuario:", user.id);
        setSuccess(true);
        setMensaje("Contraseña establecida correctamente, pero tu perfil podría estar incompleto. Contacta a un preceptor después de iniciar sesión.");
      } else {
        setSuccess(true);
        setMensaje("Contraseña establecida correctamente. Redirigiendo al inicio de sesión...");
      }
      
      // Cerrar sesión actual para que se loguee correctamente
      await supabase.auth.signOut();
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setSuccess(false);
      setMensaje(err.message || "Error al establecer contraseña");
      setDebugInfo(prevDebug => ({
        ...prevDebug,
        errorFinal: err.message,
        action: "finalError"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Enlace inválido</h2>
              <p>El enlace de activación no es válido o ha expirado</p>
            </div>
            <div className="auth-alert error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {mensaje}
            </div>
            <button
              className="auth-button"
              onClick={() => navigate("/activar-cuenta")}
            >
              Solicitar nuevo enlace
            </button>
            
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
  }

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Establecer contraseña</h2>
            <p>Crea una contraseña segura para tu cuenta</p>
          </div>

          {/* Mensajes de error/éxito */}
          {mensaje && (
            <div className={`auth-alert ${success ? "success" : "error"}`}>
              <i
                className={`bi ${success ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}
              ></i>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Nueva contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar contraseña"}
            </button>
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
}