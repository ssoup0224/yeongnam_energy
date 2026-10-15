"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { pick, useLang, useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import TextSizeControl from "./TextSizeControl";
import LanguageToggle from "./LanguageToggle";
import {
  IconChevron,
  IconClose,
  IconMenu,
  IconPhone,
  IconSearch,
  IconUser,
  SkWings,
} from "./Icons";

export default function SiteHeader() {
  const pathname = usePathname();
  const { lang } = useLang();
  const t = useT();
  const { user, logout } = useAuth();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close the mega menu / drawer whenever the route changes. Adjusting state
  // during render (rather than in an effect) avoids a cascading re-render.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenIdx(null);
    setDrawer(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIdx(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  const userName = user ? pick(user.name, lang) : "";

  return (
    <>
      {/* ── Utility bar ─────────────────────────────────────────── */}
      <div className="hidden border-b border-ink-200 bg-white lg:block no-print">
        <div className="shell flex h-11 items-center justify-between text-[0.8125rem]">
          <p className="flex items-center gap-2 text-ink-500">
            <span className="rounded-full bg-sk-red-50 px-2 py-0.5 font-semibold text-sk-red-600">
              {pick(SITE.region, lang)}
            </span>
            <span>
              {t(`${pick(SITE.group, lang)} 도시가스 공급사`, `A ${pick(SITE.group, lang)} city-gas supplier`)}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <a
              href={`tel:${SITE.safetyLine}`}
              className="flex min-h-9 items-center gap-1.5 rounded-full px-3 font-bold text-sk-red-600 hover:bg-sk-red-50"
            >
              <IconPhone className="size-4" />
              {t("가스누출 신고", "Report a leak")} {SITE.safetyLine}
            </a>
            <span className="mx-1 h-4 w-px bg-ink-200" aria-hidden />
            <LanguageToggle compact />
            <span className="mx-1 h-4 w-px bg-ink-200" aria-hidden />
            <TextSizeControl compact />
            <span className="mx-1 h-4 w-px bg-ink-200" aria-hidden />
            <Link href="/support/qna" className="flex min-h-9 items-center px-3 text-ink-600 hover:text-ink-900">
              {t("온라인 상담", "Online Q&A")}
            </Link>
            {user ? (
              <>
                <span className="flex min-h-9 items-center px-3 font-semibold text-ink-800">
                  {t(`${userName}님`, userName)}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="flex min-h-9 items-center rounded-full px-3 text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                >
                  {t("로그아웃", "Log out")}
                </button>
              </>
            ) : (
              <Link href="/login" className="flex min-h-9 items-center px-3 text-ink-600 hover:text-ink-900">
                {t("로그인", "Log in")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-ink-200 bg-white/95 backdrop-blur no-print"
        onMouseLeave={() => setOpenIdx(null)}
      >
        <div className="shell flex h-16 items-center gap-3 lg:h-[4.5rem]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={t(
              `${pick(SITE.company, lang)} ${pick(SITE.region, lang)} 홈으로`,
              `${pick(SITE.company, lang)} ${pick(SITE.region, lang)} — home`,
            )}
          >
            <SkWings className="h-6 w-10 lg:h-7 lg:w-12" />
            <span className="flex flex-col leading-none">
              <span className="text-[1.0625rem] font-extrabold tracking-tight text-ink-900 lg:text-[1.1875rem]">
                {pick(SITE.company, lang)}
              </span>
              <span className="mt-0.5 text-[0.6875rem] font-semibold text-sk-red-600">
                {pick(SITE.region, lang)} · {pick(SITE.group, lang)}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            ref={navRef}
            aria-label={t("주요 메뉴", "Main menu")}
            className="ml-6 hidden flex-1 lg:block"
          >
            <ul className="flex items-center gap-1">
              {NAV.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-expanded={openIdx === i}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onMouseEnter={() => setOpenIdx(i)}
                    onFocus={() => setOpenIdx(i)}
                    className={`relative flex h-[4.5rem] items-center px-4 text-[0.9375rem] font-bold transition
                      ${isActive(item.href) ? "text-sk-red-600" : "text-ink-700 hover:text-sk-red-600"}`}
                  >
                    {pick(item.label, lang)}
                    {isActive(item.href) && (
                      <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full sk-gradient" aria-hidden />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Link
              href="/search"
              aria-label={t("사이트 검색", "Search the site")}
              className="flex size-11 items-center justify-center rounded-full text-ink-700 hover:bg-ink-100"
            >
              <IconSearch className="size-5" />
            </Link>
            {user ? (
              <Link
                href="/"
                className="hidden h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-bold text-white hover:bg-ink-800 lg:flex"
              >
                <IconUser className="size-4" />
                {t(`${userName}님`, userName)}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-bold text-white hover:bg-ink-800 lg:flex"
              >
                <IconUser className="size-4" />
                {t("로그인", "Log in")}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label={t("전체 메뉴 열기", "Open menu")}
              aria-expanded={drawer}
              className="flex size-11 items-center justify-center rounded-full text-ink-900 hover:bg-ink-100 lg:hidden"
            >
              <IconMenu className="size-6" />
            </button>
          </div>
        </div>

        {/* ── Mega menu ─────────────────────────────────────────── */}
        {openIdx !== null ? (
          <div
            className="absolute inset-x-0 top-full hidden border-t border-ink-200 bg-white shadow-[0_18px_40px_-20px_rgba(17,21,29,.35)] lg:block"
            onMouseLeave={() => setOpenIdx(null)}
          >
            <div className="shell grid grid-cols-[minmax(0,14rem)_1fr] gap-10 py-8">
              <div>
                <p className="text-xl font-extrabold text-ink-900">{pick(NAV[openIdx].label, lang)}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {t("자주 쓰는 업무를 한 곳에서 처리하세요.", "Handle your most common tasks in one place.")}
                </p>
                <Link
                  href={NAV[openIdx].href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-sk-red-600 hover:underline"
                >
                  {t("전체 보기", "View all")} <IconChevron className="size-3.5" />
                </Link>
              </div>
              <ul className="grid grid-cols-3 gap-x-4 gap-y-1">
                {NAV[openIdx].children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="block rounded-xl px-4 py-3 transition hover:bg-ink-50"
                    >
                      <span className="block text-[0.9375rem] font-bold text-ink-800">{pick(c.label, lang)}</span>
                      {c.desc ? (
                        <span className="mt-0.5 block text-[0.8125rem] text-ink-500">{pick(c.desc, lang)}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden no-print" role="dialog" aria-modal="true" aria-label={t("전체 메뉴", "Menu")}>
          <button
            type="button"
            aria-label={t("메뉴 닫기", "Close menu")}
            className="absolute inset-0 bg-ink-900/50"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-white fade-up">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink-200 px-4">
              <span className="font-extrabold text-ink-900">{t("전체 메뉴", "Menu")}</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label={t("메뉴 닫기", "Close menu")}
                className="flex size-11 items-center justify-center rounded-full hover:bg-ink-100"
              >
                <IconClose className="size-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-ink-200 px-4 py-3">
              {user ? (
                <div className="flex flex-1 items-center gap-2">
                  <Link
                    href="/"
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 text-sm font-bold text-white"
                  >
                    <IconUser className="size-4" /> {t(`${userName}님`, userName)}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-11 items-center rounded-xl border border-ink-200 px-3 text-sm font-bold text-ink-600"
                  >
                    {t("로그아웃", "Log out")}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 text-sm font-bold text-white"
                >
                  <IconUser className="size-4" /> {t("로그인", "Log in")}
                </Link>
              )}
              <LanguageToggle />
            </div>

            <nav aria-label={t("전체 메뉴", "Menu")} className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              {NAV.map((item) => (
                <details key={item.href} className="group border-b border-ink-100 last:border-0">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-3 text-[0.9375rem] font-bold text-ink-900">
                    {pick(item.label, lang)}
                    <IconChevron className="size-4 text-ink-400 transition group-open:rotate-90" />
                  </summary>
                  <ul className="pb-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="flex min-h-12 items-center rounded-lg px-5 text-[0.875rem] text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                        >
                          {pick(c.label, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>

            <a
              href={`tel:${SITE.safetyLine}`}
              className="flex min-h-14 shrink-0 items-center justify-center gap-2 border-t border-ink-200 bg-sk-red-50 text-sm font-bold text-sk-red-700"
            >
              <IconPhone className="size-4" /> {t("가스누출 신고", "Report a leak")} {SITE.safetyLine}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
