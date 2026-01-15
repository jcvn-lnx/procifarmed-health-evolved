import heroImg from "@/assets/procifarmed-hero.jpg";
import prodVitaminas from "@/assets/prod-vitaminas.jpg";
import prodTermometro from "@/assets/prod-termometro.jpg";
import prodCreme from "@/assets/prod-creme.jpg";
import prodXarope from "@/assets/prod-xarope.jpg";
import type { Product } from "@/types/catalog";

export const categories = [
  "Medicamentos",
  "Higiene & Cuidados",
  "Infantil",
  "Wellness",
  "Equipamentos",
] as const;

export const purposes = ["Imunidade", "Dor & Febre", "Dermocosméticos", "Medição", "Vitaminas"] as const;

export const catalogHero = {
  imageSrc: heroImg,
  imageAlt: "Banner institucional da Procifarmed com estética médica clean.",
};

export const products: Product[] = [
  {
    id: "vitaminas-60",
    sku: "PROC-IMUN-0060",
    name: "Vitaminas Diárias – 60 cápsulas",
    category: "Wellness",
    purpose: "Vitaminas",
    priceCents: 8950,
    imageSrc: prodVitaminas,
    imageAlt: "Frasco de vitaminas com rótulo Procifarmed.",
    shortDescription: "Suporte nutricional diário com formulação equilibrada.",
    description:
      "Fórmula de suporte diário com vitaminas essenciais. Desenvolvida para rotinas modernas, com foco em qualidade e procedência.",
    technicalInfo: [
      { label: "Apresentação", value: "Frasco com 60 cápsulas" },
      { label: "Uso", value: "Adulto" },
      { label: "Armazenamento", value: "Local seco e arejado" },
    ],
    highlights: ["Rastreabilidade", "Padronização de qualidade", "Embalagem segura"],
    isFeatured: true,
    badges: ["Destaque"],
  },
  {
    id: "termometro-digital",
    sku: "PROC-MED-0101",
    name: "Termômetro Digital Pro",
    category: "Equipamentos",
    purpose: "Medição",
    priceCents: 12990,
    imageSrc: prodTermometro,
    imageAlt: "Termômetro digital em embalagem branca com detalhes vermelhos.",
    shortDescription: "Leitura rápida e precisa para uso doméstico e clínico.",
    description:
      "Equipamento compacto com display digital, pensado para medições rápidas. Ideal para rotinas de cuidado em casa e em ambientes profissionais.",
    technicalInfo: [
      { label: "Tempo de leitura", value: "Aproximadamente 10–30s" },
      { label: "Display", value: "Digital" },
      { label: "Uso", value: "Adulto e infantil" },
    ],
    highlights: ["Fácil higienização", "Design ergonômico", "Excelente legibilidade"],
    isFeatured: true,
    badges: ["Novo"],
  },
  {
    id: "creme-hidratante-100",
    sku: "PROC-DER-0200",
    name: "Creme Hidratante 100ml",
    category: "Higiene & Cuidados",
    purpose: "Dermocosméticos",
    priceCents: 4590,
    imageSrc: prodCreme,
    imageAlt: "Tubo de creme hidratante com detalhe vermelho.",
    shortDescription: "Textura leve para rotina de cuidados com a pele.",
    description:
      "Creme com textura leve e rápida absorção. Desenvolvido para uso diário, mantendo conforto e maciez.",
    technicalInfo: [
      { label: "Conteúdo", value: "100ml" },
      { label: "Tipo de pele", value: "Todos os tipos" },
      { label: "Uso", value: "Diário" },
    ],
    highlights: ["Sensação não oleosa", "Embalagem prática", "Rotina de cuidado"],
    isFeatured: true,
  },
  {
    id: "xarope-infantil",
    sku: "PROC-INF-0300",
    name: "Xarope Infantil – Alívio de dor",
    category: "Infantil",
    purpose: "Dor & Febre",
    priceCents: 3975,
    imageSrc: prodXarope,
    imageAlt: "Caixa de xarope infantil com detalhe vermelho.",
    shortDescription: "Produto infantil com foco em cuidado e segurança.",
    description:
      "Solução infantil com posicionamento de cuidado. Consulte sempre um profissional de saúde para orientação de uso.",
    technicalInfo: [
      { label: "Uso", value: "Infantil" },
      { label: "Apresentação", value: "Frasco + cartucho" },
      { label: "Orientação", value: "Conforme recomendação profissional" },
    ],
    highlights: ["Comunicação clara", "Embalagem segura", "Suporte ao cuidado"],
  },
];
