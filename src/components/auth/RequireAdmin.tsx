import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
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

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (authLoading) return;

      // RequireAuth should be used outside, but keep it fail-closed here too.
      if (!user) {
        navigate("/entrar", { replace: true, state: { from: location.pathname } });
        return;
      }

      setChecking(true);
      try {
        const ok = await fetchIsAdmin();
        if (cancelled) return;
        setIsAdmin(ok);

        if (!ok) {
          navigate("/conta", { replace: true });
        }
      } catch {
        if (cancelled) return;
        setIsAdmin(false);
        navigate("/conta", { replace: true });
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, navigate, location.pathname]);

  if (authLoading) return null;
  if (!user) return null;
  if (checking) return null;
  if (!isAdmin) return null;

  return <>{children}</>;
}
