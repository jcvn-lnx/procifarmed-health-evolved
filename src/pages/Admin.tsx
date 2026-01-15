import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

type AdminOrderRow = {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_cents: number;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "pending_payment", label: "Aguardando pagamento" },
  { value: "processing", label: "Em separação" },
  { value: "shipped", label: "Enviado" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
] as const;

const PAYMENT_STATUS_OPTIONS = [
  { value: "awaiting", label: "Aguardando" },
  { value: "paid", label: "Pago" },
  { value: "failed", label: "Falhou" },
  { value: "refunded", label: "Estornado" },
] as const;

function formatDateBR(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export function AdminPage() {
  return (
    <RequireAuth>
      <RequireAdmin>
        <AdminInner />
      </RequireAdmin>
    </RequireAuth>
  );
}

function AdminInner() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    const m = new Map<string, string>();
    STATUS_OPTIONS.forEach((o) => m.set(o.value, o.label));
    return m;
  }, []);

  const payLabel = useMemo(() => {
    const m = new Map<string, string>();
    PAYMENT_STATUS_OPTIONS.forEach((o) => m.set(o.value, o.label));
    return m;
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id,user_id,status,payment_status,payment_method,total_cents,created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      setOrders((data as AdminOrderRow[]) ?? []);
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = async (id: string, patch: Partial<Pick<AdminOrderRow, "status" | "payment_status">>) => {
    setSavingId(id);
    try {
      const { error } = await supabase.from("orders").update(patch).eq("id", id);
      if (error) throw error;

      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
      toast.success("Pedido atualizado.");
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível atualizar o pedido.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font800 tracking-tight">Painel Admin</h1>
              <p className="mt-2 text-sm text-muted-foreground">Pedidos: listar e atualizar status/pagamento.</p>
            </div>
            <Button variant="outline" onClick={loadOrders} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>

          <Separator className="my-6" />

          {loading ? (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">Carregando...</div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">Nenhum pedido.</div>
          ) : (
            <div className="rounded-xl border bg-card shadow-elev1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => {
                    const isSaving = savingId === o.id;
                    return (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDateBR(o.created_at)}</TableCell>
                        <TableCell className="font-semibold">{formatBRL(o.total_cents)}</TableCell>
                        <TableCell>
                          <select
                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                            value={o.status}
                            onChange={(e) => updateOrder(o.id, { status: e.target.value })}
                            disabled={isSaving}
                            aria-label={`Status do pedido ${o.id}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                            {!statusLabel.has(o.status) ? <option value={o.status}>{o.status}</option> : null}
                          </select>
                        </TableCell>
                        <TableCell>
                          <select
                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                            value={o.payment_status}
                            onChange={(e) => updateOrder(o.id, { payment_status: e.target.value })}
                            disabled={isSaving}
                            aria-label={`Pagamento do pedido ${o.id}`}
                          >
                            {PAYMENT_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                            {!payLabel.has(o.payment_status) ? (
                              <option value={o.payment_status}>{o.payment_status}</option>
                            ) : null}
                          </select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/pedido/${o.id}`, "_blank")}
                            disabled={isSaving}
                          >
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
