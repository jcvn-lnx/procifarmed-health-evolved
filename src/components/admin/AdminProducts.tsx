import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { ProductFormDialog, type AdminProductRow } from "@/components/admin/ProductFormDialog";
import type { AdminProductFormValues } from "@/lib/productForms";

function formatDateBR(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export function AdminProducts() {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<AdminProductRow | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id,sku,name,category,purpose,price_cents,image_url,image_alt,short_description,description,is_active,created_at",
        )
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setProducts((data as AdminProductRow[]) ?? []);
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const openEdit = (p: AdminProductRow) => {
    setEditing(p);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const submitForm = async (values: AdminProductFormValues, helpers: { priceCents: number }) => {
    setSavingId(dialogMode === "edit" ? editing?.id ?? "_" : "__create__");
    try {
      const payload = {
        sku: values.sku.trim(),
        name: values.name.trim(),
        category: values.category.trim(),
        purpose: values.purpose.trim(),
        price_cents: helpers.priceCents,
        image_url: values.image_url?.trim() ? values.image_url.trim() : null,
        image_alt: values.image_alt?.trim() ?? "",
        short_description: values.short_description.trim(),
        description: values.description.trim(),
        is_active: values.is_active,
      };

      if (dialogMode === "create") {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Produto cadastrado.");
      } else if (dialogMode === "edit" && editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Produto atualizado.");
      }

      setDialogOpen(false);
      await loadProducts();
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível salvar o produto.");
    } finally {
      setSavingId(null);
    }
  };

  const totals = useMemo(() => {
    const active = products.filter((p) => p.is_active).length;
    return { active, total: products.length };
  }, [products]);

  const toggleActive = async (id: string, next: boolean) => {
    setSavingId(id);
    try {
      const { error } = await supabase.from("products").update({ is_active: next }).eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: next } : p)));
      toast.success(next ? "Produto ativado." : "Produto desativado.");
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível atualizar o produto.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font800 tracking-tight">Produtos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {totals.active} ativos • {totals.total} no total
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadProducts} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button variant="brand" onClick={openCreate}>
            Cadastrar produto
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {loading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">Carregando...</div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">Nenhum produto.</div>
      ) : (
        <div className="rounded-xl border bg-card shadow-elev1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => {
                const isSaving = savingId === p.id;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.purpose}</TableCell>
                    <TableCell className="font-semibold">{formatBRL(p.price_cents)}</TableCell>
                    <TableCell>
                      <Button
                        variant={p.is_active ? "brand" : "outline"}
                        size="sm"
                        onClick={() => toggleActive(p.id, !p.is_active)}
                        disabled={isSaving}
                        aria-label={p.is_active ? `Desativar ${p.name}` : `Ativar ${p.name}`}
                      >
                        {p.is_active ? "Ativo" : "Inativo"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateBR(p.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openEdit(p)} disabled={isSaving}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initial={editing}
        onSubmit={submitForm}
        busy={Boolean(savingId)}
      />
    </section>
  );
}
