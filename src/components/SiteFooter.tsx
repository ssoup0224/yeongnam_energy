import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { IconArrowRight, IconPhone, SkWings } from "./Icons";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-white no-print">
      {/* Contact strip */}
      <div className="border-b border-ink-100 bg-ink-50">
        <div className="shell grid grid-cols-1 gap-3 py-8 sm:grid-cols-2">
          <a
            href={`tel:${SITE.callCenter}`}
            className="group flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-sk-red-300 hover:shadow-sm"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sk-red-50 text-sk-red-600">
              <IconPhone className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-ink-500">고객센터 (요금·신청·상담)</span>
              <span className="block text-xl font-extrabold tracking-tight text-ink-900">
                {SITE.callCenter}
              </span>
              <span className="block text-xs text-ink-500">{SITE.hours}</span>
            </span>
            <IconArrowRight className="ml-auto size-5 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
          </a>

          <a
            href={`tel:${SITE.safetyLine}`}
            className="group flex items-center gap-4 rounded-2xl border border-sk-red-200 bg-sk-red-500 p-5 text-white transition hover:bg-sk-red-600"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20">
              <IconPhone className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-white/80">가스누출·응급 상황 (24시간)</span>
              <span className="block text-xl font-extrabold tracking-tight">{SITE.safetyLine}</span>
              <span className="block text-xs text-white/80">연중무휴 · 즉시 출동</span>
            </span>
            <IconArrowRight className="ml-auto size-5 shrink-0 text-white/60 transition group-hover:translate-x-1 group-hover:text-white" />
          </a>
        </div>
      </div>

      {/* Sitemap */}
      <div className="shell grid grid-cols-1 gap-8 py-12 md:grid-cols-5">
        {NAV.map((item) => (
          <nav key={item.label} aria-labelledby={`f-${item.href}`}>
            <h2 id={`f-${item.href}`} className="text-sm font-extrabold text-ink-900">
              {item.label}
            </h2>
            <ul className="mt-3 space-y-1">
              {item.children.slice(0, 5).map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="inline-flex min-h-8 items-center text-[0.8125rem] text-ink-500 hover:text-sk-red-600 hover:underline"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Legal */}
      <div className="border-t border-ink-100">
        <div className="shell flex flex-col gap-5 py-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <SkWings className="h-6 w-10" />
              <span className="text-base font-extrabold text-ink-900">
                영남에너지서비스<span className="ml-1 text-sk-red-600">{SITE.region}</span>
              </span>
            </div>
            <address className="mt-3 text-[0.8125rem] not-italic leading-relaxed text-ink-500">
              {SITE.address}
              <br />
              대표전화 {SITE.callCenter} · 24시간 안전상황실 {SITE.safetyLine}
            </address>
            <p className="mt-4 text-xs text-ink-400">
              COPYRIGHT © 2026 SK INNOVATION E&amp;S. ALL RIGHTS RESERVED.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[0.8125rem]">
            {[
              ["개인정보처리방침", "/policy/privacy", true],
              ["이용약관", "/policy/terms", false],
              ["SK 윤리경영 상담·제보", "/policy/ethics", false],
              ["웹 접근성 안내", "/policy/accessibility", false],
            ].map(([label, href, strong]) => (
              <li key={label as string}>
                <Link
                  href={href as string}
                  className={`inline-flex min-h-9 items-center rounded-lg px-3 hover:bg-ink-100 ${
                    strong ? "font-extrabold text-ink-900" : "text-ink-500"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spacer so the mobile tab bar never covers the last line */}
      <div className="h-16 lg:hidden" aria-hidden />
    </footer>
  );
}
