import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/catalog";
import { formatBRL } from "@/lib/format";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export function ProductPage() {
  const { id } = useParams();
  const { add } = useCart();

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="py-12">
          <Container>
            <div className="rounded-xl border bg-card p-6 shadow-elev1">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="size-4 text-primary" />
                Produto não encontrado
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Verifique o link ou volte para a loja.</p>
            </div>
          </Container>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="py-10">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <Card className="overflow-hidden shadow-elev2">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="aspect-square w-full object-cover"
                  loading="eager"
                />
              </Card>
            </div>

            <div className="space-y-5 md:col-span-7">
              <div className="flex flex-wrap gap-2">
                {product.badges?.map((b) => (
                  <Badge key={b} variant={b === "Novo" ? "soft" : "brand"}>
                    {b}
                  </Badge>
                ))}
                <Badge variant="outline">SKU {product.sku}</Badge>
              </div>

              <h1 className="font-display text-3xl font800 tracking-tight">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.shortDescription}</p>

              <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-elev1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Preço</div>
                  <div className="font-display text-2xl font800">{formatBRL(product.priceCents)}</div>
                </div>
                <Button variant="brand" size="lg" onClick={() => add(product)}>
                  Adicionar ao carrinho
                </Button>
              </div>

              <Separator />

              <section className="space-y-3">
                <h2 className="font-display text-xl font800 tracking-tight">Descrição</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font800 tracking-tight">Informações técnicas</h2>
                <div className="grid gap-3 rounded-xl border bg-card p-5 shadow-elev1 sm:grid-cols-2">
                  {product.technicalInfo.map((it) => (
                    <div key={it.label} className="rounded-lg border bg-background p-4">
                      <div className="text-xs font-semibold text-muted-foreground">{it.label}</div>
                      <div className="mt-1 text-sm font-bold">{it.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font800 tracking-tight">Destaques</h2>
                <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {product.highlights.map((h) => (
                    <li key={h} className="rounded-lg border bg-card p-4 shadow-elev1">
                      {h}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="rounded-xl border bg-accent p-5 text-sm text-accent-foreground">
                Aviso: As informações exibidas são demonstrativas. Para uso de medicamentos, siga orientação profissional.
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
