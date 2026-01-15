import { Container } from "@/components/layout/Container";
import { PointerHalo } from "@/components/layout/PointerHalo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { catalogHero, products } from "@/data/catalog";
import { ShieldCheck, Truck, BadgeCheck, Stethoscope, ArrowRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Index = () => {
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <PointerHalo className="absolute inset-0 bg-hero" />
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute right-[-220px] top-[-260px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute left-[-260px] bottom-[-300px] h-[560px] w-[560px] rounded-full bg-primary/10 blur-3xl" />
          </div>

          <Container className="relative grid gap-10 py-14 md:grid-cols-12 md:py-20">
            <div className="space-y-6 md:col-span-6 md:pr-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground shadow-elev1">
                <ShieldCheck className="size-4 text-primary" />
                Compra segura • Procedência • Atendimento profissional
              </div>

              <h1 className="font-display text-4xl font800 leading-[1.06] tracking-tight md:text-5xl">
                Procifarmed: e-commerce farmacêutico com foco em confiança.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Navegue por categorias essenciais, encontre produtos com informações claras e conte com uma experiência pensada
                para credibilidade, qualidade e eficiência.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="brand" size="lg">
                  <NavLink to="/loja">
                    Ver produtos <ArrowRight className="ml-1 size-4" />
                  </NavLink>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <NavLink to="/institucional">Conheça a Procifarmed</NavLink>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 md:grid-cols-3">
                {[
                  { icon: BadgeCheck, title: "Qualidade", desc: "Curadoria e padronização" },
                  { icon: Truck, title: "Logística", desc: "Prazos e rastreio" },
                  { icon: Stethoscope, title: "Suporte", desc: "Comunicação clara" },
                ].map((it) => (
                  <div key={it.title} className="rounded-xl border bg-card p-4 shadow-elev1">
                    <it.icon className="size-5 text-primary" />
                    <div className="mt-2 text-sm font-bold">{it.title}</div>
                    <div className="text-xs text-muted-foreground">{it.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6">
              <Card className="overflow-hidden shadow-elev2">
                <img
                  src={catalogHero.imageSrc}
                  alt={catalogHero.imageAlt}
                  className="h-[320px] w-full object-cover md:h-[460px]"
                  loading="eager"
                />
              </Card>
              <p className="mt-3 text-xs text-muted-foreground">
                Referência visual institucional. Imagens e produtos são exemplos para demonstração.
              </p>
            </div>
          </Container>
        </section>

        {/* Categories */}
        <section className="py-14">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font800 tracking-tight">Categorias em destaque</h2>
                <p className="mt-2 text-sm text-muted-foreground">Explore rapidamente as principais linhas de produto.</p>
              </div>
              <Button asChild variant="link" className="hidden md:inline-flex">
                <NavLink to="/loja">Ver catálogo</NavLink>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {["Medicamentos", "Higiene & Cuidados", "Infantil", "Equipamentos"].map((c) => (
                <NavLink
                  key={c}
                  to="/loja"
                  className="group rounded-xl border bg-card p-5 shadow-elev1 transition-colors hover:bg-accent"
                >
                  <div className="text-sm font-bold group-hover:text-accent-foreground">{c}</div>
                  <div className="mt-2 text-sm text-muted-foreground">Ver opções e informações</div>
                </NavLink>
              ))}
            </div>
          </Container>
        </section>

        {/* Why */}
        <section className="py-14">
          <Container>
            <div className="grid gap-10 rounded-2xl border bg-card p-8 shadow-elev2 md:grid-cols-12">
              <div className="space-y-3 md:col-span-5">
                <h2 className="font-display text-2xl font800 tracking-tight">Por que escolher a Procifarmed</h2>
                <p className="text-sm text-muted-foreground">
                  Um padrão visual e informacional alinhado a grandes marcas do setor, com foco em clareza e segurança.
                </p>
              </div>

              <div className="grid gap-4 md:col-span-7 md:grid-cols-2">
                {[
                  {
                    title: "Transparência",
                    desc: "Informações objetivas, ficha técnica e comunicação responsável.",
                  },
                  {
                    title: "Padrões de qualidade",
                    desc: "Apresentação institucional, selos e mensagens de procedência.",
                  },
                  {
                    title: "Experiência moderna",
                    desc: "Layout clean, hierarquia clara e navegação eficiente.",
                  },
                  {
                    title: "Suporte profissional",
                    desc: "Canais comerciais visíveis e orientação ao cliente.",
                  },
                ].map((it) => (
                  <div key={it.title} className="rounded-xl border bg-background p-5">
                    <div className="text-sm font-bold">{it.title}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{it.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Featured products */}
        <section className="py-14">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font800 tracking-tight">Produtos em destaque</h2>
                <p className="mt-2 text-sm text-muted-foreground">Curadoria de itens com alta procura e boa informação.</p>
              </div>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <NavLink to="/loja">Ver todos</NavLink>
              </Button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <Separator className="my-10" />

            <div className="grid gap-4 rounded-2xl border bg-card p-8 shadow-elev2 md:grid-cols-3">
              {[
                { title: "Selo de Procedência", desc: "Produtos com origem e descrição consistentes." },
                { title: "Compra segura", desc: "Boas práticas de UX e comunicação transparente." },
                { title: "Atendimento", desc: "Canais comerciais sempre visíveis no site." },
              ].map((it) => (
                <div key={it.title} className="rounded-xl border bg-background p-5">
                  <div className="text-sm font-bold">{it.title}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{it.desc}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
