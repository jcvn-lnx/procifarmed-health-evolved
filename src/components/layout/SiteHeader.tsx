import { NavLink } from "@/components/NavLink";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import procifarmedLogo from "@/assets/procifarmed-logo.jpg";
import { Search, ShoppingBag, Trash2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SiteHeader() {
  const { user } = useAuth();
  const { items, count, subtotalCents, remove, setQuantity } = useCart();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const topLinks = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/loja", label: "Loja" },
      { to: "/institucional", label: "Institucional" },
      { to: "/contato", label: "Contato" },
    ],
    [],
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3" aria-label="Procifarmed">
            <div className="grid size-9 place-items-center overflow-hidden rounded-lg bg-card shadow-elev1">
              <img
                src={procifarmedLogo}
                alt="Logo Procifarmed"
                className="h-full w-full object-cover"
                decoding="async"
              />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font800 tracking-tight">Procifarmed</div>
              <div className="text-xs text-muted-foreground">Saúde • Qualidade • Procedência</div>
            </div>
          </NavLink>
        </div>


        <nav className="hidden items-center gap-1 md:flex">
          {topLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="bg-accent text-accent-foreground"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden w-[320px] items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-elev1 lg:flex">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar produtos..."
              className="h-8 border-0 bg-transparent px-0 py-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir carrinho" className="relative">
                <ShoppingBag />
                {count > 0 ? (
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {count}
                  </span>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Carrinho</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {items.length === 0 ? (
                  <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">
                    Seu carrinho está vazio. Explore a loja e adicione produtos.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="rounded-lg border bg-card p-3 shadow-elev1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{product.name}</div>
                            <div className="text-xs text-muted-foreground">SKU {product.sku}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(product.id)}
                            aria-label="Remover"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setQuantity(product.id, quantity - 1)}
                              aria-label="Diminuir"
                            >
                              −
                            </Button>
                            <div className="w-10 text-center text-sm font-semibold">{quantity}</div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setQuantity(product.id, quantity + 1)}
                              aria-label="Aumentar"
                            >
                              +
                            </Button>
                          </div>
                          <div className="text-sm font-bold">{formatBRL(product.priceCents * quantity)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Subtotal</div>
                  <div className="font-display text-lg font800">{formatBRL(subtotalCents)}</div>
                </div>

                <Button
                  variant="brand"
                  className={cn("w-full", items.length === 0 && "opacity-50")}
                  disabled={items.length === 0}
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar compra
                </Button>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
