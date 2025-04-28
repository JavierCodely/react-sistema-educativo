// src/components/notificaciones/NotificacionItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Notificacion, TipoNotificacion } from '../../types/notificacionTypes';
import { Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface NotificacionItemProps {
  notificacion: Notificacion;
  onMarcarLeida: (id: string) => void;
  onEliminar: (id: string) => void;
}

const NotificacionItem: React.FC<NotificacionItemProps> = ({ 
  notificacion, 
  onMarcarLeida,
  onEliminar
}) => {
  const navigate = useNavigate();
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew] = useState(!notificacion.leida);
  
  // Efecto para aplicar animación cuando el componente se monta
  useEffect(() => {
    if (isNew && itemRef.current) {
      itemRef.current.classList.add('notification-new');
    }
  }, [isNew]);

  // Crear efecto de ripple al hacer clic
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "ripple";
    
    // Eliminar ripple anterior si existe
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Eliminar el ripple después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Obtener el color del badge según el tipo de notificación
  const getBadgeColor = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case TipoNotificacion.ACADEMICO:
        return 'info';
      case TipoNotificacion.ADMINISTRATIVO:
        return 'secondary';
      case TipoNotificacion.BECA:
        return 'success';
      case TipoNotificacion.EXAMEN:
        return 'warning';
      default:
        return 'primary';
    }
  };

  // Formatear la fecha
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manejar el clic en la notificación
  const handleClick = () => {
    if (!notificacion.leida) {
      onMarcarLeida(notificacion.id);
    }
    
    if (notificacion.link) {
      navigate(notificacion.link);
    }
  };
  
  // Manejar la eliminación con animación
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (itemRef.current) {
      setIsDeleting(true);
      
      // Añadir clase de animación
      itemRef.current.classList.add('notification-delete');
      
      // Eliminar después de que termine la animación
      setTimeout(() => {
        onEliminar(notificacion.id);
      }, 280);
    } else {
      onEliminar(notificacion.id);
    }
  };

  return (
    <div 
      ref={itemRef}
      className={`notification-item p-3 border-bottom ${!notificacion.leida ? 'unread' : ''}`}
      onClick={(e) => {
        createRipple(e);
        handleClick();
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div className="w-100">
          <h6 className={`mb-1 ${!notificacion.leida ? 'fw-bold' : ''}`}>
            {notificacion.titulo}
            {!notificacion.leida && (
              <span className="ms-2">
                <Badge bg="danger" pill className="badge-pulse">Nuevo</Badge>
              </span>
            )}
          </h6>
          <p className="mb-1 small text-muted">{formatearFecha(notificacion.fecha)}</p>
          <Badge bg={getBadgeColor(notificacion.tipo)} className="mb-2">
            {notificacion.tipo}
          </Badge>
          <p className="mb-1">{notificacion.mensaje}</p>
          
          {/* Detalles adicionales para notificaciones de examen */}
          {notificacion.tipo === TipoNotificacion.EXAMEN && notificacion.detalles && (
            <div className="mt-2 p-2 bg-light rounded">
              <p className="mb-1"><strong>Materia:</strong> {notificacion.detalles.materia}</p>
              <p className="mb-1"><strong>Profesor:</strong> {notificacion.detalles.profesor}</p>
              <p className="mb-0">
                <strong>Nota:</strong> 
                <span className={`ms-1 ${
                  (notificacion.detalles.nota || 0) >= 7 ? 'text-success' : 
                  (notificacion.detalles.nota || 0) >= 4 ? 'text-warning' : 'text-danger'
                }`}>
                  {notificacion.detalles.nota}
                </span>
              </p>
            </div>
          )}
          
          {/* Enlace para notificaciones con link */}
          {notificacion.link && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 mt-2 see-more" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(notificacion.link || '');
              }}
            >
              Ver más información
            </Button>
          )}
        </div>
        
        <Button 
          variant="light" 
          size="sm" 
          className="text-danger" 
          onClick={handleDelete}
          aria-label="Eliminar"
          style={{ opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s' }}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    </div>
  );
};

export default NotificacionItem;