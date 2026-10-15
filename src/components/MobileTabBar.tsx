"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pick, useLang, useT } from "@/lib/i18n";
import { IconBill, IconCenter, IconDoc, IconHome, IconMenu } from "./Icons";

const TABS = [
  { href: "/", label: { ko: "홈", en: "Home" }, Icon: IconHome },
  { href: "/bill", label: { ko: "요금·납부", en: "Billing" }, Icon: IconBill },
  { href: "/guide", label: { ko: "상황별 안내", en: "Guides" }, Icon: IconDoc },
  { href: "/centers", label: { ko: "서비스센터", en: "Centers" }, Icon: IconCenter },
  { href: "/sitemap", label: { ko: "전체", en: "All" }, Icon: IconMenu },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const { lang } = useLang();
  const t = useT();

  return (
    <nav
      aria-label={t("빠른 이동", "Quick navigation")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/97 backdrop-blur lg:hidden no-print"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold transition
                  ${active ? "text-sk-red-600" : "text-ink-500"}`}
              >
                <Icon className="size-[1.375rem]" />
                {pick(label, lang)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
