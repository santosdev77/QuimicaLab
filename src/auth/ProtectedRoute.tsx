import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth(); const location = useLocation();
  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-500">Carregando sua sessão...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
