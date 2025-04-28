// src/components/notificaciones/NotificacionesDropdown.tsx
import React, { useEffect, useRef } from "react";
import { NavDropdown, Badge, Button, Spinner } from "react-bootstrap";
import { useNotificaciones } from "../../contexts/NotificacionesContext";
import NotificacionItem from "./NotificacionItem";

const NotificacionesDropdown: React.FC = () => {
  const {
    notificaciones,
    notificacionesNoLeidas,
    loading,
    error,
    cargarNotificaciones,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
  } = useNotificaciones();
  
  const bellRef = useRef<HTMLAnchorElement>(null);
  
  // Añadir animación de campana cuando hay notificaciones nuevas
  useEffect(() => {
    if (notificacionesNoLeidas > 0 && bellRef.current) {
      bellRef.current.classList.add('bell-animation');
    } else if (bellRef.current) {
      bellRef.current.classList.remove('bell-animation');
    }
  }, [notificacionesNoLeidas]);

  return (
    <NavDropdown
      title={
        <span>
          <a 
            ref={bellRef}
            href="/notificaciones" 
            className="nav-link bi bi-bell-fill me-1"
            onClick={(e) => {
              // Prevenir navegación si es un clic en el dropdown
              if (e.currentTarget.getAttribute('aria-expanded') === 'true') {
                e.preventDefault();
              }
            }}
          > Notificaciones
            {notificacionesNoLeidas > 0 && (
              <Badge
                pill
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle badge-pulse"
              >
                {notificacionesNoLeidas}
              </Badge>
            )}
          </a>
        </span>
      }
      id="notificaciones-dropdown"
      align="end"
      className="position-relative notificaciones-dropdown"
    >
      <div className="notification-header px-3 py-2 d-flex justify-content-between align-items-center border-bottom">
        <h6 className="mb-0">Notificaciones</h6>
        {notificacionesNoLeidas > 0 && (

          <Button
            variant="link"
            size="sm"
            className="p-0 text-decoration-none see-more"
            onClick={(e) => {
              e.preventDefault();
              marcarTodasComoLeidas();
            }}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div
        className="notification-body"
        style={{ maxHeight: "350px", overflowY: "auto", width: "350px" }}
      >
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <span className="ms-2">Cargando notificaciones...</span>
          </div>
        ) : error ? (
          <div className="text-center text-danger py-4">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
            <Button
              variant="link"
              size="sm"
              className="d-block mx-auto mt-2 see-more"
              onClick={(e) => {
                e.preventDefault();
                cargarNotificaciones();
              }}
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              Reintentar
            </Button>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-bell-slash me-2"></i>
            No tienes notificaciones
          </div>
        ) : (
          notificaciones
            .slice(0, 5)
            .map((notificacion) => (
              <NotificacionItem
                key={notificacion.id}
                notificacion={notificacion}
                onMarcarLeida={marcarComoLeida}
                onEliminar={eliminarNotificacion}
              />
            ))
        )}
      </div>

      <NavDropdown.Divider />
      <NavDropdown.Item 
        className="text-center py-2" 
        href="/notificaciones"
        style={{ transition: 'background-color 0.2s ease' }}
      >
        <span className="d-flex align-items-center justify-content-center">
          Ver todas las notificaciones
          <i className="bi bi-arrow-right-short ms-1"></i>
        </span>
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default NotificacionesDropdown;