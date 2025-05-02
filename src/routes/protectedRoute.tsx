// src/routes/protectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { supabase } from '../services/auth/supabase/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar si hay una sesión activa en Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setDebug({ type: "error", message: error.message });
          throw error;
        }

        if (!session) {
          // No hay sesión, redirigir al login
          setDebug({ type: "no_session" });
          setIsLoading(false);
          return;
        }

        // Si hay un usuario en el contexto y coincide con la sesión actual, no hacemos nada
        if (user && user.email === session.user.email) {
          setDebug({ type: "user_exists_in_context", user });
          setIsLoading(false);
          return;
        }

        // Si hay sesión pero no hay usuario en el contexto (por ejemplo, después de recargar la página)
        // recuperamos los datos del usuario desde la tabla usuario
        const { data: profileData, error: profileError } = await supabase
          .from('usuario')
          .select('dni, nombre, rol')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData) {
          setDebug({ 
            type: "profile_error", 
            error: profileError ? profileError.message : "Perfil no encontrado",
            user_id: session.user.id,
            user_email: session.user.email
          });
          throw new Error('No se pudo obtener el perfil del usuario');
        }

        // Actualizamos el contexto con los datos del usuario
        const userData = {
          dni: profileData.dni,
          name: profileData.nombre,
          email: session.user.email || '',
          role: profileData.rol
        };
        
        setDebug({ type: "user_loaded", userData });
        login(userData);

      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setDebug({ type: "exception", error: error.message });
        logout(); // Limpiamos el contexto en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [login, logout, user]);

  if (isLoading) {
    // Puedes mostrar un componente de carga mientras se verifica la sesión
    return <div className="loading-spinner">Cargando...</div>;
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene el rol permitido
  if (!allowedRoles.includes(user.role)) {
    // Redirigir a la página correspondiente a su rol
    return <Navigate to={`/${user.role}/StudentDashboard`} replace />;
  }

  // Si el usuario está autenticado y tiene el rol correcto, mostrar la ruta protegida
  return (
    <>
      {/* Información de debug - Solo visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && debug && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          backgroundColor: '#f0f0f0', 
          padding: '10px',
          borderRadius: '5px',
          maxWidth: '300px',
          fontSize: '12px',
          zIndex: 9999,
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          <strong>ProtectedRoute Debug:</strong>
          <pre>{JSON.stringify(debug, null, 2)}</pre>
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;