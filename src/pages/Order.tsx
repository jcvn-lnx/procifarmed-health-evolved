import { RequireAuth } from "@/components/auth/RequireAuth";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type OrderRow = {
  id: string;
  status: string;
  total_cents: number;
  payment_status: string;
  payment_instructions: string | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

export function OrderPage() {
  return (
    <RequireAuth>
      <OrderInner />
    </RequireAuth>
  );
}

function OrderInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: o, error: oErr } = await supabase
          .from("orders")
          .select("id,status,total_cents,payment_status,payment_instructions,created_at")
          .eq("id", id)
          .maybeSingle();
        if (oErr) throw oErr;
        if (!o) {
          setOrder(null);
          setItems([]);
          return;
        }
        setOrder(o as OrderRow);

        const { data: it, error: itErr } = await supabase
          .from("order_items")
          .select("id,product_name,unit_price_cents,quantity")
          .eq("order_id", id)
          .order("created_at", { ascending: true });
        if (itErr) throw itErr;
        setItems((it as OrderItemRow[]) ?? []);
      } catch (err: any) {
        toast.error(err?.message ?? "Não foi possível carregar o pedido.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <Container>
          {loading ? (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">Carregando...</div>
          ) : !order ? (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">
              Pedido não encontrado.
              <div className="mt-4">
                <Button variant="outline" onClick={() => navigate("/conta")}>Voltar</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-xl border bg-card p-6 shadow-elev1">
                <h1 className="font-display text-3xl font800 tracking-tight">Pedido confirmado</h1>
                <p className="mt-2 text-sm text-muted-foreground">ID do pedido: {order.id}</p>

                <Separator className="my-6" />

                <h2 className="font-display text-lg font800">Itens</h2>
                <div className="mt-4 space-y-3">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{it.product_name}</div>
                        <div className="text-xs text-muted-foreground">Qtd: {it.quantity}</div>
                      </div>
                      <div className="text-sm font-bold">{formatBRL(it.unit_price_cents * it.quantity)}</div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="rounded-xl border bg-card p-6 shadow-elev1">
                <h2 className="font-display text-lg font800">Pagamento</h2>
                <div className="mt-3 text-sm text-muted-foreground">Status: {order.payment_status}</div>
                <div className="mt-4 rounded-lg border bg-background p-4">
                  <pre className="whitespace-pre-wrap text-sm">{order.payment_instructions ?? "Instruções indisponíveis."}</pre>
                </div>
                <Separator className="my-6" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-xl font800">{formatBRL(order.total_cents)}</span>
                </div>
                <div className="mt-6">
                  <Button variant="brand" className="w-full" onClick={() => navigate("/conta")}>
                    Ir para minha conta
                  </Button>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
