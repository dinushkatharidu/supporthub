import { Navigate, useLocation } from "react-router-dom";
import type { Role } from "../types/auth";
import { useAuth } from "./AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // logged in but role not allowed
  if (allowedRoles && allowedRoles.length > 0) {
    const ok = user?.roles?.some((r) => allowedRoles.includes(r));
    if (!ok) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
