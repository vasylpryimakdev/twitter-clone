import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

export const AuthRedirectHandler = () => {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status === "loading" || !user) return;

    const publicRoutes = ["/login", "/signup"];

    if (publicRoutes.includes(location.pathname)) {
      navigate("/");
    }
  }, [user, status, location.pathname, navigate]);

  return null;
};
