import { RequireAuth } from "@/components/auth/RequireAuth";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
  is_default: boolean;
};

export function AccountPage() {
  return (
    <RequireAuth>
      <AccountInner />
    </RequireAuth>
  );
}

function AccountInner() {
  const { user, profile, refreshProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // new address
  const [label, setLabel] = useState("Entrega");
  const [recipientName, setRecipientName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile?.full_name, profile?.phone]);

  const loadAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select(
          "id,label,recipient_name,phone,postal_code,street,number,complement,neighborhood,city,state,is_default",
        )
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses((data as Address[]) ?? []);
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível carregar endereços.");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone: phone || null })
        .eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Dados atualizados.");
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível salvar.");
    } finally {
      setSavingProfile(false);
    }
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const isDefault = addresses.length === 0;
      const { error } = await supabase.from("addresses").insert({
        user_id: user.id,
        label,
        recipient_name: recipientName,
        phone: addrPhone || null,
        postal_code: postalCode,
        street,
        number,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city,
        state,
        country: "BR",
        is_default: isDefault,
      });
      if (error) throw error;

      toast.success("Endereço adicionado.");
      await loadAddresses();

      setRecipientName("");
      setAddrPhone("");
      setPostalCode("");
      setStreet("");
      setNumber("");
      setComplement("");
      setNeighborhood("");
      setCity("");
      setState("");
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível adicionar o endereço.");
    }
  };

  const setDefault = async (addressId: string) => {
    if (!user) return;
    try {
      // unset others
      const { error: clearErr } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      if (clearErr) throw clearErr;

      const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", addressId);
      if (error) throw error;

      toast.success("Endereço padrão atualizado.");
      await loadAddresses();
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível atualizar.");
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", addressId);
      if (error) throw error;
      toast.success("Endereço removido.");
      await loadAddresses();
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível remover.");
    }
  };

  const doSignOut = async () => {
    await signOut();
    toast.success("Você saiu da conta.");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font800 tracking-tight">Minha conta</h1>
              <p className="mt-2 text-sm text-muted-foreground">Gerencie seus dados e endereços de entrega.</p>
            </div>
            <Button variant="outline" onClick={doSignOut}>Sair</Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border bg-card p-6 shadow-elev1">
              <h2 className="font-display text-lg font800">Dados do cliente</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nome completo</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input value={user?.email ?? ""} disabled />
                </div>
              </div>
              <div className="mt-5">
                <Button variant="brand" onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </section>

            <section className="rounded-xl border bg-card p-6 shadow-elev1">
              <h2 className="font-display text-lg font800">Endereços</h2>
              {loadingAddresses ? (
                <div className="mt-4 text-sm text-muted-foreground">Carregando...</div>
              ) : addresses.length === 0 ? (
                <div className="mt-4 text-sm text-muted-foreground">Nenhum endereço cadastrado.</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="rounded-lg border bg-background p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
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
                        <div className="flex items-center gap-2">
                          {!a.is_default ? (
                            <Button variant="outline" size="sm" onClick={() => setDefault(a.id)}>
                              Tornar padrão
                            </Button>
                          ) : null}
                          <Button variant="outline" size="sm" onClick={() => removeAddress(a.id)}>
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-6" />

              <h3 className="font-display text-base font800">Adicionar endereço</h3>
              <form onSubmit={addAddress} className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Identificação</Label>
                  <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Destinatário</Label>
                  <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
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
                  <Input value={state} onChange={(e) => setState(e.target.value)} required placeholder="SP" />
                </div>
                <div className="sm:col-span-2">
                  <Button variant="outline" className="w-full" type="submit">
                    Adicionar
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
