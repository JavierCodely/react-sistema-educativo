// src/pages/auth/TestSupabaseEmail.tsx
import React, { useState } from "react";
import { supabase } from "../../services/auth/supabase/supabaseClient";

export default function TestSupabaseEmail() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testOtpEmail = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Intenta enviar OTP (Magic Link)
      const otpResult = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/establecer-password`,
        }
      });
      
      setResult({
        method: "signInWithOtp",
        data: otpResult.data,
        error: otpResult.error
      });
    } catch (err) {
      setResult({
        method: "signInWithOtp",
        error: {
          message: err.message,
          name: err.name,
          stack: err.stack
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testResetPassword = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Intenta enviar reseteo de contraseña
      const resetResult = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/establecer-password`,
      });
      
      setResult({
        method: "resetPasswordForEmail",
        data: resetResult.data,
        error: resetResult.error
      });
    } catch (err) {
      setResult({
        method: "resetPasswordForEmail",
        error: {
          message: err.message,
          name: err.name,
          stack: err.stack
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSignUp = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Intenta crear cuenta (esto puede fallar si el usuario ya existe)
      const signUpResult = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-10), // Contraseña aleatoria temporal
        options: {
            
          emailRedirectTo: `${window.location.origin}/establecer-password`,
        }
      });
      
      setResult({
        method: "signUp",
        data: signUpResult.data,
        error: signUpResult.error
      });
    } catch (err) {
      setResult({
        method: "signUp",
        error: {
          message: err.message,
          name: err.name,
          stack: err.stack
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Prueba de envío de correos de Supabase</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
          Correo electrónico:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "8px", 
            borderRadius: "4px",
            border: "1px solid #ccc" 
          }}
        />
      </div>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={testOtpEmail}
          disabled={isLoading}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#6366F1", 
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer" 
          }}
        >
          Probar Magic Link
        </button>
        
        <button
          onClick={testResetPassword}
          disabled={isLoading}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#3B82F6", 
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer" 
          }}
        >
          Probar Reset Password
        </button>
        
        <button
          onClick={testSignUp}
          disabled={isLoading}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#10B981", 
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer" 
          }}
        >
          Probar Sign Up
        </button>
      </div>
      
      {isLoading && (
        <div style={{ marginBottom: "20px", color: "#6366F1" }}>
          Enviando solicitud...
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Resultado ({result.method}):</h2>
          <pre style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "4px",
            overflow: "auto",
            maxHeight: "400px"
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}