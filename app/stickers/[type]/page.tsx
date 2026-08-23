import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import StandaloneConfigurator, { type StickerType } from "@/components/StandaloneConfigurator";
import VinylConfigurator, { type MaterialId } from "@/components/VinylConfigurator";
import QRConfigurator from "@/components/QRConfigurator";
import EasyPeelConfigurator from "@/components/EasyPeelConfigurator";
import StaticClingConfigurator from "@/components/StaticClingConfigurator";

const VALID_TYPES: StickerType[] = ["vinyl", "holographic", "glitter", "chrome", "sheets"];
const EXTRA_TYPES = ["qr", "easy-peel", "static-cling"] as const;
type ExtraType = (typeof EXTRA_TYPES)[number];

// Holographic/Glitter/Chrome used to be separate pages — they're now materials
// inside the unified Vinyl page (legal-distancing redesign, 2026-07-16).
const MATERIAL_REDIRECTS: Partial<Record<StickerType, MaterialId>> = {
  holographic: "holographic",
  glitter: "glitter",
  chrome: "chrome",
};

const VALID_MATERIALS: MaterialId[] = ["vinyl", "holographic", "chrome", "glitter", "clear"];

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ material?: string }>;
};

export function generateStaticParams() {
  return [...VALID_TYPES, ...EXTRA_TYPES].map((type) => ({ type }));
}

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "What are the recommended file formats?",
    a: "We recommend sending PNG, JPG, PDF, and Adobe Illustrator files. When uploading, use high-resolution files (300 DPI or higher). Transparent backgrounds are preferred, but our instant online proof system will remove most backgrounds automatically.",
  },
  {
    q: "What happens if I upload an AI-generated image?",
    a: "We cannot guarantee the quality of the print. Most AI-generated files are created at a lower resolution, so results may vary. We do make every effort to clean the image up as much as possible.",
  },
  {
    q: "How durable are the vinyl stickers?",
    a: "Our stickers are made using premium American-sourced material. They're waterproof, UV and scratch resistant, and laminated in gloss or matte for extra protection — with a 3–5 year outdoor rating.",
  },
  {
    q: "Do I get a proof before printing?",
    a: "Yes! When you place an order, you'll receive a free online proof where you can adjust border thickness and color. If it doesn't look right, leave a note and we'll fix it — every proof is reviewed by a person and you'll get an update within 24 hours.",
  },
  {
    q: "How long until I receive my stickers?",
    a: "99% of orders ship within 24–48 hours of placing your order, with an average transit time of 4 days.",
  },
];

function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h2
        className="text-xs tracking-[0.35em] uppercase text-gray-500 mb-8"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-white/6">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <summary className="flex items-start justify-between gap-4 select-none">
              <span className="text-sm font-medium text-white/90 leading-snug">{q}</span>
              <span className="mt-0.5 shrink-0 text-gray-500 group-open:rotate-45 transition-transform duration-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed pr-6">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <div className="px-6 pt-8">
      <Link
        href="/collections/custom-vinyl-stickers"
        className="group inline-flex items-center gap-2.5"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        <span className="w-8 h-8 border border-white/8 flex items-center justify-center text-gray-500 group-hover:border-white/25 group-hover:text-white group-hover:bg-white/4 transition-all duration-300">
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          >
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </span>
        <span className="text-[9px] tracking-[0.4em] uppercase text-gray-500 group-hover:text-white transition-colors duration-300">
          All Sticker Types
        </span>
      </Link>
    </div>
  );
}

export default async function StickerTypePage({ params, searchParams }: Props) {
  const { type } = await params;

  if (EXTRA_TYPES.includes(type as ExtraType)) {
    return (
      <main className="min-h-screen overflow-x-hidden max-w-6xl mx-auto">
        <BackLink />
        {type === "qr" ? (
          <QRConfigurator />
        ) : type === "easy-peel" ? (
          <EasyPeelConfigurator />
        ) : (
          <StaticClingConfigurator />
        )}
        <FAQSection />
      </main>
    );
  }

  if (!VALID_TYPES.includes(type as StickerType)) notFound();

  const redirectMaterial = MATERIAL_REDIRECTS[type as StickerType];
  if (redirectMaterial) redirect(`/stickers/vinyl?material=${redirectMaterial}`);

  const { material } = await searchParams;
  const initialMaterial: MaterialId = VALID_MATERIALS.includes(material as MaterialId)
    ? (material as MaterialId)
    : "vinyl";

  return (
    <main className="min-h-screen overflow-x-hidden max-w-6xl mx-auto">
      <BackLink />

      {type === "vinyl" ? (
        <VinylConfigurator initialMaterial={initialMaterial} />
      ) : (
        <StandaloneConfigurator stickerType={type as StickerType} />
      )}

      <FAQSection />
    </main>
  );
}
