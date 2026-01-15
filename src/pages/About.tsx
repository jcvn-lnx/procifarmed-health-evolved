import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HeartPulse, Target, Eye, ShieldCheck } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="py-10">
        <Container>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font800 tracking-tight">Sobre a Procifarmed</h1>
            <p className="text-sm text-muted-foreground">
              Uma presença institucional moderna, construída para confiança no segmento farmacêutico e medical.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12">
            <Card className="p-7 shadow-elev2 md:col-span-7">
              <h2 className="font-display text-xl font800 tracking-tight">Compromisso com qualidade, saúde e segurança</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A Procifarmed atua com foco em procedência e clareza de informações, com uma experiência digital alinhada às
                melhores práticas do setor. Nosso e-commerce foi pensado para navegação objetiva, hierarquia visual clara e
                comunicação responsável.
              </p>

              <Separator className="my-6" />

              <div className="grid gap-4 sm:grid-cols-2">
                {["Curadoria e padronização de conteúdo", "Experiência clean e corporativa", "Mensagens institucionais e selos", "Atenção a acessibilidade e usabilidade"].map(
                  (t) => (
                    <div key={t} className="rounded-xl border bg-background p-5">
                      <div className="text-sm font-bold">{t}</div>
                    </div>
                  ),
                )}
              </div>
            </Card>

            <div className="space-y-4 md:col-span-5">
              {[
                { icon: HeartPulse, title: "Missão", desc: "Facilitar o acesso a produtos e informações com segurança." },
                { icon: Eye, title: "Visão", desc: "Ser referência em experiência digital institucional no setor." },
                { icon: Target, title: "Valores", desc: "Qualidade, ética, clareza e foco no cuidado." },
                { icon: ShieldCheck, title: "Qualidade", desc: "Processos e comunicação consistentes em toda a jornada." },
              ].map((it) => (
                <Card key={it.title} className="p-6 shadow-elev1">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <it.icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{it.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
