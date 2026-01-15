import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { categories, purposes } from "@/data/catalog";
import {
  adminProductFormSchema,
  brlToCents,
  centsToBRLInput,
  type AdminProductFormValues,
} from "@/lib/productForms";

export type AdminProductRow = {
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
  created_at: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: AdminProductRow | null;
  onSubmit: (values: AdminProductFormValues, helpers: { priceCents: number }) => Promise<void>;
  busy?: boolean;
};

export function ProductFormDialog({ open, onOpenChange, mode, initial, onSubmit, busy }: Props) {
  const form = useForm<AdminProductFormValues>({
    resolver: zodResolver(adminProductFormSchema),
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      purpose: "",
      price: "0,00",
      image_url: "",
      image_alt: "",
      short_description: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      form.reset({
        sku: initial.sku,
        name: initial.name,
        category: initial.category,
        purpose: initial.purpose,
        price: centsToBRLInput(initial.price_cents),
        image_url: initial.image_url ?? "",
        image_alt: initial.image_alt ?? "",
        short_description: initial.short_description ?? "",
        description: initial.description ?? "",
        is_active: initial.is_active,
      });
    }

    if (mode === "create") {
      form.reset({
        sku: "",
        name: "",
        category: categories[0] ?? "",
        purpose: purposes[0] ?? "",
        price: "0,00",
        image_url: "",
        image_alt: "",
        short_description: "",
        description: "",
        is_active: true,
      });
    }
  }, [open, mode, initial, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Cadastrar produto" : "Editar produto"}</DialogTitle>
          <DialogDescription>Preencha os campos e salve. (Imagens: por enquanto use uma URL.)</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              const priceCents = brlToCents(values.price);
              await onSubmit(values, { priceCents });
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PROC-IMUN-0060" autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="decimal" placeholder="89,50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Vitaminas Diárias – 60 cápsulas" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input {...field} list="categories" placeholder="Wellness" />
                    </FormControl>
                    <datalist id="categories">
                      {categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finalidade</FormLabel>
                    <FormControl>
                      <Input {...field} list="purposes" placeholder="Vitaminas" />
                    </FormControl>
                    <datalist id="purposes">
                      {purposes.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt da imagem</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex.: Frasco de vitaminas..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição curta</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Suporte nutricional diário..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} placeholder="Fórmula de suporte diário..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
                  <div>
                    <FormLabel>Ativo na loja</FormLabel>
                    <div className="text-xs text-muted-foreground">Se desativado, não aparece na vitrine.</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancelar
              </Button>
              <Button type="submit" variant="brand" disabled={busy}>
                {busy ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
