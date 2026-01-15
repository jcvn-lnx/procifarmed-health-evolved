import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SignupPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      toast.success("Conta criada com sucesso.");
      navigate("/conta", { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <Container className="max-w-lg">
          <h1 className="font-display text-3xl font800 tracking-tight">Criar conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Usaremos seus dados para facilitar entregas e histórico de pedidos.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-elev1">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            <Button variant="brand" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Button type="button" variant="link" className="h-auto p-0" onClick={() => navigate("/entrar")}>
                Entrar
              </Button>
            </div>
          </form>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
