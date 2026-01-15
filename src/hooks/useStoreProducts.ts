import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { mapDbProductToCatalogProduct, type DbProduct } from "@/lib/productMapper";

export function useStoreProducts() {
  return useQuery({
    queryKey: ["store", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,sku,name,category,purpose,price_cents,image_url,image_alt,short_description,description,is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      const rows = (data ?? []) as DbProduct[];
      return rows.map(mapDbProductToCatalogProduct);
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export function useStoreProduct(productId?: string) {
  return useQuery({
    queryKey: ["store", "product", productId ?? null],
    enabled: Boolean(productId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,sku,name,category,purpose,price_cents,image_url,image_alt,short_description,description,is_active")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapDbProductToCatalogProduct(data as DbProduct);
    },
    staleTime: 60_000,
    retry: 1,
  });
}
