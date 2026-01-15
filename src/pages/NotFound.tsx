import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-14">
        <Container>
          <div className="rounded-2xl border bg-card p-10 text-center shadow-elev2">
            <h1 className="font-display text-5xl font800 tracking-tight">404</h1>
            <p className="mt-2 text-sm text-muted-foreground">Página não encontrada.</p>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="brand">
                <NavLink to="/">Voltar para a Home</NavLink>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
