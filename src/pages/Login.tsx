import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? "/conta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const timeoutMs = 10000;

    try {
      const { error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<{ error: Error }>((_, reject) => setTimeout(() => reject(new Error("login_timeout")), timeoutMs)),
      ]);

      if (error) throw error;

      toast.success("Login realizado com sucesso.");

      // Destrava UI antes de navegar (evita ficar preso em "Entrando..." caso a rota demore)
      setLoading(false);
      queueMicrotask(() => navigate(from, { replace: true }));
    } catch (err: any) {
      toast.error(err?.message === "login_timeout" ? "Tempo esgotado ao entrar. Tente novamente." : err?.message ?? "Não foi possível entrar.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <Container className="max-w-lg">
          <h1 className="font-display text-3xl font800 tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acesse sua conta para finalizar pedidos e gerenciar endereços.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-elev1">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="brand" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Button type="button" variant="link" className="h-auto p-0" onClick={() => navigate("/cadastrar")}>
                Criar conta
              </Button>
            </div>
          </form>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
