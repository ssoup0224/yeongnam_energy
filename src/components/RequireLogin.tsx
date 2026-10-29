"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth, type User } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { IconArrowRight, IconLock } from "./Icons";

/**
 * Renders children only for signed-in members; otherwise a sign-in card
 * that returns here afterwards.
 */
export default function RequireLogin({
  reason,
  children,
}: {
  reason?: string;
  children: (user: User) => ReactNode;
}) {
  const t = useT();
  const pathname = usePathname();
  const { user, ready } = useAuth();

  if (!ready) return <div className="min-h-64" aria-hidden />;
  if (user) return <>{children(user)}</>;

  return (
    <div className="rounded-[1.25rem] border border-ink-200 bg-white p-8 text-center lg:p-10">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-ink-100 text-ink-600">
        <IconLock className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-extrabold text-ink-900">{t("로그인이 필요합니다", "Please sign in")}</h2>
      <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
        {reason ?? t("회원 계정에 연결된 정보라 로그인 후 이용할 수 있습니다.", "This is tied to your member account, so you'll need to sign in.")}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl sk-gradient px-6 text-[0.9375rem] font-extrabold text-white hover:brightness-95"
        >
          {t("로그인", "Log in")} <IconArrowRight className="size-4" />
        </Link>
        <Link
          href={`/signup?next=${encodeURIComponent(pathname)}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-ink-200 px-6 text-[0.9375rem] font-bold text-ink-700 hover:border-ink-300"
        >
          {t("회원가입", "Sign up")}
        </Link>
      </div>
    </div>
  );
}
