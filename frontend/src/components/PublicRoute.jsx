import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth.context";

export default function PublicRoute() {
  const { isLoggedIn, role } = useAuth();
  
  // If user is logged in, redirect to their dashboard
  if (isLoggedIn) {
    if (role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      return <Navigate to="/dashboard/user" replace />;
    }
  }
  
  // If not logged in, allow access to public routes (login, signup, verify-otp)
  return <Outlet />;
}
