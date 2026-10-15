import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "@/lib/i18n";
import { IconChevron, IconHome } from "./Icons";

export type Crumb = { label: ReactNode; href?: string };

export default function PageHero({
  title,
  lead,
  crumbs = [],
  tone = "light",
}: {
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  tone?: "light" | "brand";
}) {
  const brand = tone === "brand";
  return (
    <section
      className={`relative overflow-hidden border-b ${
        brand ? "sk-gradient border-transparent text-white" : "border-ink-200 bg-white"
      }`}
    >
      {brand ? null : (
        <div aria-hidden className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-sk-orange-100 opacity-50 blur-3xl" />
      )}
      <div className="shell relative py-7 lg:py-11">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-[0.75rem]">
            <li>
              <Link
                href="/"
                className={`inline-flex min-h-8 items-center gap-1 rounded px-1 ${
                  brand ? "text-white/75 hover:text-white" : "text-ink-400 hover:text-ink-700"
                }`}
              >
                <IconHome className="size-3.5" />
                <span className="sr-only"><T ko="홈" en="Home" /></span>
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                <IconChevron className={`size-3 ${brand ? "text-white/40" : "text-ink-300"}`} />
                {c.href && i < crumbs.length - 1 ? (
                  <Link
                    href={c.href}
                    className={`inline-flex min-h-8 items-center rounded px-1 ${
                      brand ? "text-white/75 hover:text-white" : "text-ink-400 hover:text-ink-700"
                    }`}
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={`inline-flex min-h-8 items-center px-1 font-bold ${
                      brand ? "text-white" : "text-ink-700"
                    }`}
                  >
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1
          className={`text-[1.625rem] font-extrabold tracking-tight sm:text-[2rem] lg:text-[2.25rem] ${
            brand ? "text-white" : "text-ink-900"
          }`}
        >
          {title}
        </h1>
        {lead ? (
          <p
            className={`mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed sm:text-base ${
              brand ? "text-white/85" : "text-ink-600"
            }`}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}
