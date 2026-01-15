import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FiltersBar, type ShopFilters } from "@/components/shop/FiltersBar";
import { ProductCard } from "@/components/shop/ProductCard";
import { products } from "@/data/catalog";
import { useMemo, useState } from "react";

const toNumberOrUndefined = (v: string) => {
  const raw = v.trim();
  if (!raw) return undefined;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

export function ShopPage() {
  const [filters, setFilters] = useState<ShopFilters>({
    q: "",
    category: "all",
    purpose: "all",
    min: "",
    max: "",
  });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const min = toNumberOrUndefined(filters.min);
    const max = toNumberOrUndefined(filters.max);

    return products.filter((p) => {
      if (q && !(`${p.name} ${p.shortDescription} ${p.sku}`.toLowerCase().includes(q))) return false;
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.purpose !== "all" && p.purpose !== filters.purpose) return false;

      const price = p.priceCents / 100;
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="py-10">
        <Container>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font800 tracking-tight">Loja</h1>
            <p className="text-sm text-muted-foreground">
              Listagem com filtros por categoria, finalidade e faixa de preço.
            </p>
          </div>

          <div className="mt-6">
            <FiltersBar value={filters} onChange={setFilters} />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">
              Nenhum produto encontrado com os filtros atuais. Ajuste a busca e tente novamente.
            </div>
          ) : null}
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
