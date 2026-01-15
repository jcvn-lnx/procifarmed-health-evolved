import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/entrar", { replace: true, state: { from: location.pathname } });
    }
  }, [loading, user, navigate, location.pathname]);

  if (loading) return null;
  if (!user) return null;
  return <>{children}</>;
}
