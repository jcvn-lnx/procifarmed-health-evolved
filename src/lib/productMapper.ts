import placeholder from "/placeholder.svg";

export type DbProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  purpose: string;
  price_cents: number;
  image_url: string | null;
  image_alt: string;
  short_description: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export const mapDbProductToCatalogProduct = (p: DbProduct) => {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category as any,
    purpose: p.purpose as any,
    priceCents: p.price_cents ?? 0,
    imageSrc: p.image_url || placeholder,
    imageAlt: p.image_alt || p.name,
    shortDescription: p.short_description || "",
    description: p.description || "",
    technicalInfo: [],
    highlights: [],
    badges: [],
  };
};

