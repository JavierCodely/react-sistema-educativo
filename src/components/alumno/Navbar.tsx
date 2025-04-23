// src/components/Navbar.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";

interface NavbarProps {
  nombreEstudiante: string;
  onNavegar: (
    seccion: "inicio" | "horarios" | "examenes" | "correlativas" | "tabs"
  ) => void;
}

const Navbar: React.FC<NavbarProps> = ({ nombreEstudiante, onNavegar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar todo el localStorage
    localStorage.clear();
    
    
    // localStorage.removeItem('token');
    // localStorage.removeItem('userData');
    // localStorage.removeItem('role');
    
    // Redireccionar al login
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand
          onClick={() => onNavegar("inicio")}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-mortarboard-fill me-2"></i>
          Sistema Universitario
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => onNavegar("inicio")}>Inicio</Nav.Link>
            <Nav.Link onClick={() => onNavegar("examenes")}>Examenes</Nav.Link>
            <NavDropdown title="Académico" id="academic-dropdown">
              <NavDropdown.Item onClick={() => onNavegar("horarios")}>
                Horarios
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => onNavegar("correlativas")}>
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