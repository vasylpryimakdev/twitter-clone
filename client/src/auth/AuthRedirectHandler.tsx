import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

export const AuthRedirectHandler = () => {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized || !user) return;

    const publicRoutes = ["/login", "/signup"];

    if (publicRoutes.includes(location.pathname)) {
      navigate("/");
    }
  }, [user, isInitialized, location.pathname, navigate]);

  return null;
};
