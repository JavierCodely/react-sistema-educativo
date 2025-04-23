// src/components/Navbar.tsx

import React, { useRef } from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  nombreEstudiante: string;
  onNavegar: (
    seccion: "inicio" | "horarios" | "examenes" | "correlativas" | "tabs"
  ) => void;
}

const Navbar: React.FC<NavbarProps> = ({ nombreEstudiante, onNavegar }) => {
  // Crear una referencia al toggle del navbar
  const navbarToggleRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar todo el localStorage
    localStorage.clear();

    // Redireccionar al login
    navigate("/login");
  };

  // Función que maneja la navegación y cierra el navbar
  const handleNavigation = (
    seccion: "inicio" | "horarios" | "examenes" | "correlativas" | "tabs"
  ) => {
    onNavegar(seccion);

    // Cierra el navbar si está abierto (en modo responsive)
    if (window.innerWidth < 992) {
      // Bootstrap lg breakpoint
      navbarToggleRef.current?.click();
    }
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand
          onClick={() => handleNavigation("inicio")}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-mortarboard-fill me-2"></i>
          Sistema Universitario
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle
          ref={navbarToggleRef}
          aria-controls="basic-navbar-nav"
        />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavigation("inicio")}>
              Inicio
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("examenes")}>
              Examenes
            </Nav.Link>
            <NavDropdown title="Académico" id="academic-dropdown">
              <NavDropdown.Item onClick={() => handleNavigation("horarios")}>
                Horarios
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => handleNavigation("correlativas")}
              >
                Plan de Correlativas
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <span>
                  <i className="bi bi-person-circle me-1"></i>
                  {nombreEstudiante}
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#perfil">Mi Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
