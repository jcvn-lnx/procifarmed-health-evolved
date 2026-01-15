import { z } from "zod";

export const brlToCents = (value: string) => {
  const raw = value.trim();
  if (!raw) return 0;

  // Accept: "12,34" "12.34" "12" "1.234,56" (naive)
  const normalized = raw
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "") // remove thousands separators
    .replace(",", ".");

  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
};

export const centsToBRLInput = (cents: number) => {
  const n = (Number(cents) || 0) / 100;
  // Keep it friendly for input (no currency symbol)
  return n.toFixed(2).replace(".", ",");
};

export const adminProductFormSchema = z.object({
  sku: z.string().trim().min(1, "SKU é obrigatório").max(80, "SKU muito longo"),
  name: z.string().trim().min(1, "Nome é obrigatório").max(140, "Nome muito longo"),
  category: z.string().trim().min(1, "Categoria é obrigatória").max(80),
  purpose: z.string().trim().min(1, "Finalidade é obrigatória").max(80),
  price: z.string().trim().min(1, "Preço é obrigatório").max(20),
  image_url: z
    .string()
    .trim()
    .max(500, "URL muito longa")
    .optional()
    .or(z.literal("")),
  image_alt: z.string().trim().max(160, "Alt muito longo").optional().or(z.literal("")),
  short_description: z.string().trim().min(1, "Descrição curta é obrigatória").max(220),
  description: z.string().trim().min(1, "Descrição é obrigatória").max(4000),
  is_active: z.boolean().default(true),
});

export type AdminProductFormValues = z.infer<typeof adminProductFormSchema>;
