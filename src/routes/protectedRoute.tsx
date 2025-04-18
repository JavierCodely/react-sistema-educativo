import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = ({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return allowedRoles.includes(user.role) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
