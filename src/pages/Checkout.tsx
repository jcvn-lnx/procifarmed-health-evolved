import { RequireAuth } from "@/components/auth/RequireAuth";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Address = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string | null;
  postal_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
};

function defaultPixInstructions(totalCents: number) {
  return `Pagamento via PIX (manual).\n\n1) Realize o PIX no valor de ${formatBRL(totalCents)}\n2) Envie o comprovante para nosso atendimento (WhatsApp / e-mail)\n3) Após confirmação, o pedido seguirá para separação e envio.\n\nChave PIX: (definir)\nFavorecido: Procifarmed (definir)`;
}

export function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutInner />
    </RequireAuth>
  );
}

function CheckoutInner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotalCents, clear } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // new address form
  const [label, setLabel] = useState("Entrega");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const totalCents = useMemo(() => subtotalCents, [subtotalCents]);

  const loadAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select(
          "id,label,recipient_name,phone,postal_code,street,number,complement,neighborhood,city,state,country,is_default",
        )
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses((data as Address[]) ?? []);
      const def = (data as Address[] | null)?.find((a) => a.is_default)?.id;
      setSelectedAddressId(def ?? (data as Address[] | null)?.[0]?.id ?? "");
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível carregar endereços.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = {
        user_id: user.id,
        label,
        recipient_name: recipientName,
        phone: phone || null,
        postal_code: postalCode,
        street,
        number,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city,
        state,
        country: "BR",
        is_default: addresses.length === 0,
      };

      const { data, error } = await supabase.from("addresses").insert(payload).select("id").single();
      if (error) throw error;

      toast.success("Endereço salvo.");
      await loadAddresses();
      if (data?.id) setSelectedAddressId(data.id);

      // reset a few fields
      setRecipientName("");
      setPhone("");
      setPostalCode("");
      setStreet("");
      setNumber("");
      setComplement("");
      setNeighborhood("");
      setCity("");
      setState("");
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível salvar o endereço.");
    }
  };

  const placeOrder = async () => {
    if (!user) return;
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Selecione um endereço de entrega.");
      return;
    }

    setPlacing(true);
    try {
      const paymentInstructions = defaultPixInstructions(totalCents);

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: selectedAddressId,
          subtotal_cents: subtotalCents,
          shipping_cents: 0,
          total_cents: totalCents,
          status: "pending_payment",
          payment_method: "pix_manual",
          payment_status: "awaiting",
          payment_instructions: paymentInstructions,
        })
        .select("id")
        .single();

      if (orderErr) throw orderErr;
      const orderId = order.id as string;

      const itemsPayload = items.map((it) => ({
        order_id: orderId,
        product_id: it.product.id,
        product_name: it.product.name,
        unit_price_cents: it.product.priceCents,
        quantity: it.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      clear();
      toast.success("Pedido criado.");
      navigate(`/pedido/${orderId}`, { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível criar o pedido.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <h1 className="font-display text-3xl font800 tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">Pagamento: PIX manual (instruções após confirmar o pedido).</p>

          {items.length === 0 ? (
            <div className="mt-8 rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-elev1">
              Seu carrinho está vazio.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-6">
                <div className="rounded-xl border bg-card p-6 shadow-elev1">
                  <h2 className="font-display text-lg font800">Endereço de entrega</h2>

                  {loading ? (
                    <div className="mt-4 text-sm text-muted-foreground">Carregando endereços...</div>
                  ) : addresses.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {addresses.map((a) => (
                        <label key={a.id} className="flex cursor-pointer gap-3 rounded-lg border bg-background p-4">
                          <input
                            type="radio"
                            name="address"
                            value={a.id}
                            checked={selectedAddressId === a.id}
                            onChange={() => setSelectedAddressId(a.id)}
                            className="mt-1"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">{a.label}</div>
                              {a.is_default ? (
                                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">Padrão</span>
                              ) : null}
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {a.recipient_name} • {a.phone ?? ""}
                            </div>
                            <div className="mt-1 text-sm">
                              {a.street}, {a.number}
                              {a.complement ? ` — ${a.complement}` : ""}
                            </div>
                            <div className="text-sm">
                              {a.neighborhood ? `${a.neighborhood} — ` : ""}
                              {a.city}/{a.state} • CEP {a.postal_code}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-muted-foreground">Nenhum endereço cadastrado ainda.</div>
                  )}

                  <Separator className="my-6" />

                  <h3 className="font-display text-base font800">Adicionar novo endereço</h3>
                  <form onSubmit={addAddress} className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Identificação</Label>
                      <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex.: Casa" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Destinatário</Label>
                      <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Nome de quem recebe" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="00000-000" required />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Rua</Label>
                      <Input value={street} onChange={(e) => setStreet(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input value={number} onChange={(e) => setNumber(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Complemento</Label>
                      <Input value={complement} onChange={(e) => setComplement(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Button variant="outline" className="w-full" type="submit">
                        Salvar endereço
                      </Button>
                    </div>
                  </form>
                </div>
              </section>

              <aside className="space-y-4">
                <div className="rounded-xl border bg-card p-6 shadow-elev1">
                  <h2 className="font-display text-lg font800">Resumo</h2>
                  <div className="mt-4 space-y-3">
                    {items.map((it) => (
                      <div key={it.product.id} className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{it.product.name}</div>
                          <div className="text-xs text-muted-foreground">Qtd: {it.quantity}</div>
                        </div>
                        <div className="text-sm font-bold">{formatBRL(it.product.priceCents * it.quantity)}</div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">{formatBRL(subtotalCents)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="font-semibold">{formatBRL(0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-display text-xl font800">{formatBRL(totalCents)}</span>
                    </div>

                    <Button variant="brand" className="w-full" disabled={placing} onClick={placeOrder}>
                      {placing ? "Confirmando..." : "Confirmar pedido"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Ao confirmar, você receberá as instruções de pagamento via PIX.
                    </p>
                  </div>
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
