import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

async function fetchIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  return Boolean(data);
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["auth", "isAdmin", user?.id ?? null],
    queryFn: fetchIsAdmin,
    enabled: Boolean(user),
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (authLoading) return;

    // RequireAuth should be used outside, but keep it fail-closed here too.
    if (!user) {
      navigate("/entrar", { replace: true, state: { from: location.pathname } });
      return;
    }

    if (!isLoading && isAdmin === false) {
      navigate("/conta", { replace: true });
    }
  }, [authLoading, user, isLoading, isAdmin, navigate, location.pathname]);

  if (authLoading) return null;
  if (!user) return null;
  if (isLoading) return null;
  if (!isAdmin) return null;

  return <>{children}</>;
}
