import { supabase } from "@/integrations/supabase/client";
import { mapDbProductToCatalogProduct, type DbProduct } from "@/lib/productMapper";
import { useCallback, useEffect, useState } from "react";

type StoreProductsState<T> = {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useStoreProducts(): StoreProductsState<ReturnType<typeof mapDbProductToCatalogProduct>[]> {
  const [data, setData] = useState<ReturnType<typeof mapDbProductToCatalogProduct>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetcher = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: rows, error } = await supabase
        .from("products")
        .select("id,sku,name,category,purpose,price_cents,image_url,image_alt,short_description,description,is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      const mapped = ((rows ?? []) as DbProduct[]).map(mapDbProductToCatalogProduct);
      setData(mapped);
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(e?.message ?? "Erro ao carregar produtos"));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return { data, isLoading, error, refetch: fetcher };
}

export function useStoreProduct(productId?: string): StoreProductsState<ReturnType<typeof mapDbProductToCatalogProduct> | null> {
  const [data, setData] = useState<ReturnType<typeof mapDbProductToCatalogProduct> | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(productId));
  const [error, setError] = useState<Error | null>(null);

  const fetcher = useCallback(async () => {
    if (!productId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data: row, error } = await supabase
        .from("products")
        .select("id,sku,name,category,purpose,price_cents,image_url,image_alt,short_description,description,is_active")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      setData(row ? mapDbProductToCatalogProduct(row as DbProduct) : null);
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(e?.message ?? "Erro ao carregar produto"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return { data, isLoading, error, refetch: fetcher };
}
