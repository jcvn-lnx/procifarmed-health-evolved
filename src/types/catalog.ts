export type ProductCategory =
  | "Medicamentos"
  | "Higiene & Cuidados"
  | "Infantil"
  | "Wellness"
  | "Equipamentos";

export type ProductPurpose =
  | "Imunidade"
  | "Dor & Febre"
  | "Dermocosméticos"
  | "Medição"
  | "Vitaminas";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  purpose: ProductPurpose;
  priceCents: number;
  imageAlt: string;
  imageSrc: string;
  shortDescription: string;
  description: string;
  technicalInfo: Array<{ label: string; value: string }>;
  highlights: string[];
  isFeatured?: boolean;
  badges?: string[];
}
