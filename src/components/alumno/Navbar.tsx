// src/components/Navbar.tsx

import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, NavDropdown } from 'react-bootstrap';

interface NavbarProps {
  nombreEstudiante: string;
}

const Navbar: React.FC<NavbarProps> = ({ nombreEstudiante }) => {
  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand href="#home">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Sistema Universitario
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Inicio</Nav.Link>
            <Nav.Link href="#materias">Materias</Nav.Link>
            <Nav.Link href="#examenes">Exámenes</Nav.Link>
            <NavDropdown title="Académico" id="academic-dropdown">
              <NavDropdown.Item href="#horarios">Horarios</NavDropdown.Item>
              <NavDropdown.Item href="#calendario">Calendario Académico</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#correlativas">Plan de Correlativas</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown title={
              <span>
                <i className="bi bi-person-circle me-1"></i>
                {nombreEstudiante}
              </span>
            } id="user-dropdown" align="end">
              <NavDropdown.Item href="#perfil">Mi Perfil</NavDropdown.Item>
              <NavDropdown.Item href="#configuracion">Configuración</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;