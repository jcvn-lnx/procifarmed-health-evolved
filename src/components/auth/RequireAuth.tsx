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

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}
