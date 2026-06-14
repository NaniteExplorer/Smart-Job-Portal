import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../layout/Loader";

/**
 * Guards routes. Waits for the initial loadUser() to resolve before deciding,
 * so a logged-in user isn't bounced to /login on a hard refresh.
 * Pass `roles` to restrict to specific roles.
 */
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, initialized, user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!initialized) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
