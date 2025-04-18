import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeFill, LockFill, PersonFill } from "react-bootstrap-icons";
import "../../styles/Login.css";
import { loginMock } from "../../services/auth/authServices";
import { useAuth } from "../../contexts/authContext";
/**
 * Componente de inicio de sesión
 *
 * Este componente permite a los usuarios autenticarse en el sistema,
 * con la opción de seleccionar su rol (alumno, profesor o preceptor).
 */
const Login = () => {
  const navigate = useNavigate();
  const [formValidated, setFormValidated] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [loginData, setLoginData] = useState({
    dni: "",
    name: "",
    email: "",
    password: "",
    role: "alumno", // Valor por defecto
  });
  const { login } = useAuth(); // obtenemos la función login
  {
    /* Función para manejar el inicio de sesión con Google */
  }
  console.log(email);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Ala implementación de la autenticación con Google
      // Por ejemplo, utilizando Firebase Authentication u otro servicio

      // Ejemplo simulado:
      // const result = await firebaseAuth.signInWithPopup(googleProvider);
      // const user = result.user;

      // Simulación de respuesta exitosa
      setSuccessMessage("Inicio de sesión con Google exitoso");
      // Navigate al dashboard según el rol seleccionado
      // navigate(`/${loginData.role}/dashboard`);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError("Error al iniciar sesión con Google. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Datos del login

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario de inicio de sesión
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      // Si pasa la validación, continúa con el login
      console.log("Formulario válido");
    }

    setFormValidated(true);
    // Validación básica
    if (!loginData.email || !loginData.password || !loginData.role) {
      setError("Por favor completa todos los campos");

      return;
    }

    setIsLoading(true);

    try {
      // Llamamos al service que simula un servidor
      const mockUser = await loginMock(
        loginData.email,
        loginData.password,
        loginData.role
      );
      const user = {
        dni: mockUser.dni,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      };
      login(user);

      setSuccessMessage("Inicio de sesión exitoso");
      setError("");
      navigate(`/${user.role}/StudentDashboard`); // Redirigimos al dashboard
    } catch (err) {
      // ⚠️ Si algo sale mal (usuario no encontrado)
      setError("Email, contraseña o rol incorrectos");
      setSuccessMessage("");
    } finally {
      // ⛔ Esto se ejecuta SIEMPRE, aunque falle el login
      setIsLoading(false);
    }
    // Aquí iría la lógica de autenticación
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
            {/* Selección de rol */}
            <div className="form-group role-selection">
              <label htmlFor="role" className="form-label">
                <PersonFill className="icon" /> Ingresar como
              </label>
              <div className="role-options">
                <div
                  className={`role-option ${
                    loginData.role === "alumno" ? "active" : ""
                  }`}
                  onClick={() =>
                    setLoginData((prev) => ({ ...prev, role: "alumno" }))
                  }
                >
                  <input
                    type="radio"
                    id="alumno"
                    name="role"
                    value="alumno"
                    checked={loginData.role === "alumno"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="alumno">Alumno</label>
                </div>

                <div
                  className={`role-option ${
                    loginData.role === "profesor" ? "active" : ""
                  }`}
                  onClick={() =>
                    setLoginData((prev) => ({ ...prev, role: "profesor" }))
                  }
                >
                  <input
                    type="radio"
                    id="profesor"
                    name="role"
                    value="profesor"
                    checked={loginData.role === "profesor"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="profesor">Profesor</label>
                </div>

                <div
                  className={`role-option ${
                    loginData.role === "preceptor" ? "active" : ""
                  }`}
                  onClick={() =>
                    setLoginData((prev) => ({ ...prev, role: "preceptor" }))
                  }
                >
                  <input
                    type="radio"
                    id="preceptor"
                    name="role"
                    value="preceptor"
                    checked={loginData.role === "preceptor"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="preceptor">Preceptor</label>
                </div>
              </div>
            </div>

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange(e);
                }}
                placeholder="tu@email.com"
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
              onClick={handleSubmit}
            >
              {isLoading ? "Iniciando sesión..." : "Ingresar"}
            </button>

            {/* Nota informativa sobre registro */}
            {/* Separador para opciones de inicio de sesión */}
            {/* Botón de inicio de sesión con Google */}
            <div className="social-auth-container">
              <button
                type="button"
                className="google-auth-button"
                onClick={() => handleGoogleLogin()}
                disabled={isLoading}
              >
                <img
                  src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                  alt="Google"
                  className="google-icon"
                />
                Iniciar sesión con Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
