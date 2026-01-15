import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="py-10">
        <Container>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font800 tracking-tight">Contato</h1>
            <p className="text-sm text-muted-foreground">Envie uma mensagem para o time comercial.</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12">
            <Card className="p-7 shadow-elev2 md:col-span-7">
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Mensagem enviada",
                    description: "Recebemos sua solicitação. Retornaremos em breve (demo).",
                  });
                  (e.currentTarget as HTMLFormElement).reset();
                }}
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Nome</Label>
                    <Input required placeholder="Seu nome" />
                  </div>
                  <div className="grid gap-2">
                    <Label>E-mail</Label>
                    <Input required type="email" placeholder="nome@empresa.com" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Assunto</Label>
                  <Input required placeholder="Ex.: pedidos, parcerias, suporte" />
                </div>

                <div className="grid gap-2">
                  <Label>Mensagem</Label>
                  <Textarea required rows={6} placeholder="Descreva sua necessidade" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Este formulário é demonstrativo. Integração com e-mail/CRM pode ser configurada.
                  </p>
                  <Button variant="brand" type="submit">
                    Enviar
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4 md:col-span-5">
              <Card className="p-6 shadow-elev1">
                <div className="text-sm font-bold">Informações comerciais</div>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div>comercial@procifarmed.com.br</div>
                  <div>(00) 0000-0000</div>
                  <div>Seg–Sex • 08h–18h</div>
                </div>
              </Card>

              <Card className="p-6 shadow-elev1">
                <div className="text-sm font-bold">Endereço</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Rua Exemplo, 123 • Centro • Cidade/UF
                </div>
              </Card>

              <Card className="p-6 shadow-elev1">
                <div className="text-sm font-bold">Atendimento</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Respostas em até 1 dia útil (padrão demonstrativo).
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
