// src/pages/auth/ActivarCuenta.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {supabase} from "../../services/auth/supabase/supabaseClient";
import "../../styles/Login.css";

export default function ActivarCuenta() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{ data: any; error: any } | null>(null);


  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setSuccess(false);
    setIsLoading(true);
    setDebugInfo(null);

    try {
      if (!email.endsWith("@its.edu.ar")) {
        throw new Error("Solo se permiten correos institucionales (@its.edu.ar)");
      }

      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/establecer-password`,
      });

      // Guardar información de debug
      setDebugInfo({ data, error });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      setMensaje("Revisá tu correo institucional para continuar con la activación");
    } catch (err) {
      setSuccess(false);
      setMensaje(err.message || "Error al enviar el enlace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Activar cuenta institucional</h2>
            <p>Ingresá tu correo para recibir un enlace de activación</p>
          </div>

          {/* Mensajes de error/éxito */}
          {mensaje && (
            <div className={`auth-alert ${success ? "success" : "error"}`}>
              <i className={`bi ${success ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSendLink} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico institucional
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="tuusuario@its.edu.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button" 
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar enlace de activación"}
            </button>

            <div className="auth-links">
              <Link to="/login">Volver al inicio de sesión</Link>
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
}