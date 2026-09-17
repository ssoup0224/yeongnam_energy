"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBill, IconCenter, IconDoc, IconHome, IconMenu } from "./Icons";

const TABS = [
  { href: "/", label: "홈", Icon: IconHome },
  { href: "/bill", label: "요금·납부", Icon: IconBill },
  { href: "/guide", label: "상황별 안내", Icon: IconDoc },
  { href: "/centers", label: "서비스센터", Icon: IconCenter },
  { href: "/sitemap", label: "전체", Icon: IconMenu },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="빠른 이동"
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
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
