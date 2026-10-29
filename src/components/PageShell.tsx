import type { ReactNode } from "react";
import PageHero from "./PageHero";
import { T, type Bi } from "@/lib/i18n";

export type BiCrumb = { label: Bi; href?: string };

/** Section crumbs shared by every page. */
export const CRUMB = {
  use: { label: { ko: "도시가스 이용", en: "Using Gas" }, href: "/use" },
  bill: { label: { ko: "요금·납부", en: "Billing" }, href: "/bill" },
  safety: { label: { ko: "안전·점검", en: "Safety" }, href: "/safety" },
  support: { label: { ko: "고객지원", en: "Support" }, href: "/support" },
  about: { label: { ko: "회사소개", en: "Company" }, href: "/about" },
} satisfies Record<string, BiCrumb>;

/** Bilingual page hero + standard content container. */
export default function PageShell({
  title,
  lead,
  crumbs,
  tone,
  wide,
  children,
}: {
  title: Bi;
  lead?: Bi;
  crumbs: BiCrumb[];
  tone?: "light" | "brand";
  /** Use the full shell width (default narrows forms to a readable column). */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        title={<T ko={title.ko} en={title.en} />}
        lead={lead ? <T ko={lead.ko} en={lead.en} /> : undefined}
        crumbs={crumbs.map((c) => ({ label: <T ko={c.label.ko} en={c.label.en} />, href: c.href }))}
        tone={tone}
      />
      <div className="shell py-10 lg:py-14">
        <div className={wide ? "" : "mx-auto max-w-3xl"}>{children}</div>
      </div>
    </>
  );
}
