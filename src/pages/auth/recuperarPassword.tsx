// src/pages/auth/RecuperarPassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/auth/supabase/supabaseClient";
import "../../styles/Login.css";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!email.endsWith("@its.edu.ar")) {
        throw new Error("Solo se permiten correos institucionales (@its.edu.ar)");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/establecer-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      setMensaje("Revisá tu correo institucional para restablecer tu contraseña");
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
            <h2>Recuperar contraseña</h2>
            <p>Ingresá tu correo para recibir un enlace de recuperación</p>
          </div>

          {/* Mensajes de error/éxito */}
          {mensaje && (
            <div className={`auth-alert ${success ? "success" : "error"}`}>
              <i className={`bi ${success ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="auth-form">
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
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>

            <div className="auth-links">
              <Link to="/login">Volver al inicio de sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}