// /components/PrivateRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading, isSuperAdmin } = useAuth();
  const [localIsSuperAdmin, setLocalIsSuperAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const superAdmin = localStorage.getItem("isSuperAdmin") === "1";
    setLocalIsSuperAdmin(superAdmin);
  }, []);

  if (loading) return null;

  // Si la ruta comienza con /admins, verificar si es superadmin
  if (location.pathname.startsWith("/admins")) {
    return isAuthenticated && (isSuperAdmin || localIsSuperAdmin) ? (
      children
    ) : (
      <Navigate to="/admin" replace />
    );
  }

  // Para otras rutas, solo verificar autenticación
  return isAuthenticated ? children : <Navigate to="/" replace />;
}
