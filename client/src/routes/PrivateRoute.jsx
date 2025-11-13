// src/routes/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Ruta protegida con control de autenticación y roles.
 * - Redirige al login si no hay usuario.
 * - Si se pasa `allowedRoles`, redirige al dashboard si el usuario no pertenece.
 */
function PrivateRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.user);

  //  No autenticado → al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  Si hay restricción de roles y no cumple → al dashboard
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  //  Autenticado y con rol permitido
  return children;
}

export default PrivateRoute;
