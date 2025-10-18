import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth.context";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}