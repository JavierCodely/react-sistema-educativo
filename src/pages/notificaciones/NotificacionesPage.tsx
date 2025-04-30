// src/pages/NotificacionesPage.tsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Notificacion, TipoNotificacion } from '../../types/notificacionTypes';
import NotificacionesService from '../../services/api/notificaciones/notificacionesServices';
import NotificacionItem from '../../components/notificaciones/NotificacionItem';

const NotificacionesPage: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroActivo, setFiltroActivo] = useState<TipoNotificacion | 'TODAS'>('TODAS');

  // Cargar las notificaciones al montar el componente
  useEffect(() => {
    cargarNotificaciones();
  }, []);

  // Función para cargar las notificaciones
  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await NotificacionesService.getNotificaciones();
      setNotificaciones(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las notificaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Marcar una notificación como leída
  const marcarComoLeida = async (id: string) => {
    try {
      await NotificacionesService.marcarComoLeida(id);
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  // Marcar todas las notificaciones como leídas
  const marcarTodasComoLeidas = async () => {
    try {
      await NotificacionesService.marcarTodasComoLeidas();
      setNotificaciones(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      );
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  // Eliminar una notificación
  const eliminarNotificacion = async (id: string) => {
    try {
      await NotificacionesService.eliminarNotificacion(id);
      setNotificaciones(prev => prev.filter(notif => notif.id !== id));
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  // Filtrar notificaciones según el filtro activo
  const notificacionesFiltradas = filtroActivo === 'TODAS' 
    ? notificaciones 
    : notificaciones.filter(n => n.tipo === filtroActivo);

  return (
    <Container>
      <h2 className="mb-4">Mis Notificaciones</h2>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Cargando notificaciones...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-3"
            onClick={cargarNotificaciones}
          >
            Reintentar
          </Button>
        </Alert>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Filtrar por tipo</h5>
              </div>
              {notificaciones.some(n => !n.leida) && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={marcarTodasComoLeidas}
                >
                  Marcar todas como leídas
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant={filtroActivo === 'TODAS' ? 'primary' : 'outline-primary'}
                  onClick={() => setFiltroActivo('TODAS')}
                >
                  Todas
                </Button>
                <Button 
                  variant={filtroActivo === TipoNotificacion.ACADEMICO ? 'info' : 'outline-info'}
                  onClick={() => setFiltroActivo(TipoNotificacion.ACADEMICO)}
                >
                  Académicas
                </Button>
                <Button 
                  variant={filtroActivo === TipoNotificacion.EXAMEN ? 'warning' : 'outline-warning'}
                  onClick={() => setFiltroActivo(TipoNotificacion.EXAMEN)}
                >
                  Exámenes
                </Button>
                <Button 
                  variant={filtroActivo === TipoNotificacion.BECA ? 'success' : 'outline-success'}
                  onClick={() => setFiltroActivo(TipoNotificacion.BECA)}
                >
                  Becas
                </Button>
                <Button 
                  variant={filtroActivo === TipoNotificacion.ADMINISTRATIVO ? 'secondary' : 'outline-secondary'}
                  onClick={() => setFiltroActivo(TipoNotificacion.ADMINISTRATIVO)}
                >
                  Administrativas
                </Button>
              </div>
            </Card.Body>
          </Card>

          {notificacionesFiltradas.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <i className="bi bi-bell-slash fs-1 text-muted"></i>
                <h4 className="mt-3">No hay notificaciones</h4>
                <p className="text-muted">
                  {filtroActivo === 'TODAS' 
                    ? 'No tienes notificaciones por el momento.' 
                    : `No tienes notificaciones de tipo ${filtroActivo}.`}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              <Col>
                <Card>
                  {notificacionesFiltradas.map(notificacion => (
                    <NotificacionItem 
                    key={notificacion.id}
                    notificacion={notificacion}
                    onMarcarLeida={marcarComoLeida}
                    onEliminar={eliminarNotificacion}
                  />
                ))}
              </Card>
            </Col>
          </Row>
        )}
      </>
    )}
  </Container>
);
};

export default NotificacionesPage;