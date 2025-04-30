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
//creamos el componente para las notificaciones
const NotificacionItem: React.FC<NotificacionItemProps> = ({ 
  notificacion, 
  onMarcarLeida,
  onEliminar
}) => {
  //creamos el navigate para la navegación
  const navigate = useNavigate();
  //creamos el ref para el item
  const itemRef = useRef<HTMLDivElement>(null);
  //creamos el estado para la eliminación
  const [isDeleting, setIsDeleting] = useState(false);
  //creamos el estado para la nueva notificación
  const [isNew] = useState(!notificacion.leida);
  
  // Efecto para aplicar animación cuando el componente se monta
  useEffect(() => {
    //si la notificación es nueva y el item esta referenciado, añadimos la animación
    if (isNew && itemRef.current) {
      //añadimos la animación
      itemRef.current.classList.add('notification-new');
    }
  }, [isNew]);//dependemos de la nueva notificación

  //creamos el efecto de ripple al hacer clic
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    //obtenemos el boton
    const button = event.currentTarget;
    //creamos el ripple
    const ripple = document.createElement("span");
    //obtenemos el rectangulo del boton
    const rect = button.getBoundingClientRect();
    //obtenemos el tamaño del boton
    const size = Math.max(rect.width, rect.height);
    //obtenemos la posicion x del boton
    const x = event.clientX - rect.left - size / 2;
    //obtenemos la posicion y del boton
    const y = event.clientY - rect.top - size / 2;
    //seteamos el tamaño del ripple
    ripple.style.width = ripple.style.height = `${size}px`;
    //seteamos la posicion x del ripple
    ripple.style.left = `${x}px`;
    //seteamos la posicion y del ripple
    ripple.style.top = `${y}px`;
    //añadimos la clase ripple
    ripple.className = "ripple";
    //eliminamos el ripple anterior si existe
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      //eliminamos el ripple anterior
      existingRipple.remove();
    }
    //añadimos el ripple al boton
    button.appendChild(ripple);
    //eliminamos el ripple despues de la animación
    setTimeout(() => {
      //eliminamos el ripple
      ripple.remove();
    }, 600);
  };

  //creamos la funcion para obtener el color del badge según el tipo de notificación
  const getBadgeColor = (tipo: TipoNotificacion) => {
    //dependiendo del tipo de notificación, retornamos el color
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
    //creamos la fecha
    const fecha = new Date(fechaString);
    //retornamos la fecha formateada
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  //creamos la funcion para manejar el clic en la notificación
  const handleClick = () => {
    //si la notificación no esta leida, marcamos como leida
    if (!notificacion.leida) {
      onMarcarLeida(notificacion.id);
    }
    //si la notificación tiene un link, navegamos a ese link
    if (notificacion.link) {
      navigate(notificacion.link);
    }
  };
  
  //creamos la funcion para manejar la eliminación con animación
  const handleDelete = (e: React.MouseEvent) => {
    //detenemos la propagación del evento
    e.stopPropagation();
    //si el item esta referenciado, seteamos la eliminación a true
    if (itemRef.current) {
      setIsDeleting(true);
      //añadimos la clase de animación
      itemRef.current.classList.add('notification-delete');
      //eliminamos el item despues de que termine la animación
      setTimeout(() => {
        //eliminamos la notificación
        onEliminar(notificacion.id);
      }, 280);
    } else {
      //eliminamos la notificación
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