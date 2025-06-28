import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    console.log("ProtectedRoute - Current path:", location.pathname);
    console.log("ProtectedRoute - isAuthenticated from context:", isAuthenticated);
    console.log("ProtectedRoute - Token exists:", !!token);
    console.log("ProtectedRoute - Username exists:", !!username);
  }, [location.pathname, isAuthenticated]);

  // Si no hay token o username en localStorage, redirigir a login
  if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
    console.log("ProtectedRoute - No auth data in localStorage, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si hay datos en localStorage pero el contexto no está sincronizado
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Context not synced, but localStorage has data");
    return children;
  }

  return children;
}

export default ProtectedRoute;
