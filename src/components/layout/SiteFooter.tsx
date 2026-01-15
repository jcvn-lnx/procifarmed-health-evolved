import { Container } from "@/components/layout/Container";
import { NavLink } from "@/components/NavLink";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <Container className="grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-display text-lg font800 tracking-tight">Procifarmed</div>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            E-commerce farmacêutico e medical com foco em credibilidade, procedência e excelência na experiência.
          </p>
          <div className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Procifarmed. Todos os direitos reservados.
          </div>
        </div>

        <div className="grid gap-6 md:col-span-7 md:grid-cols-3">
          <div>
            <div className="text-sm font-bold">Institucional</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/institucional" className="hover:text-foreground">
                  Sobre a Procifarmed
                </NavLink>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold">Loja</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/loja" className="hover:text-foreground">
                  Produtos
                </NavLink>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  Entrega e prazos
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  Trocas e devoluções
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold">Contato</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>comercial@procifarmed.com.br</li>
              <li>(00) 0000-0000</li>
              <li className="pt-2">Seg–Sex • 08h–18h</li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t bg-muted/30">
        <Container className="py-4 text-xs text-muted-foreground">
          Aviso: Este site é um protótipo demonstrativo. Informações de produtos e preços são exemplos.
        </Container>
      </div>
    </footer>
  );
}
