import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/types/catalog";
import { ShoppingCart } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <Card className="group overflow-hidden shadow-elev1 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.badges?.map((b) => (
            <Badge key={b} variant={b === "Novo" ? "soft" : "brand"}>
              {b}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2 p-5">
        <div className="text-xs font-semibold text-muted-foreground">
          {product.category} • {product.purpose}
        </div>

        <NavLink to={`/produto/${product.id}`} className="block">
          <h3 className="font-display text-base font800 leading-snug tracking-tight group-hover:underline">
            {product.name}
          </h3>
        </NavLink>

        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="font-display text-lg font800">{formatBRL(product.priceCents)}</div>
          <Button variant="brand" size="icon" aria-label="Adicionar ao carrinho" onClick={() => add(product)}>
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </Card>
  );
}
