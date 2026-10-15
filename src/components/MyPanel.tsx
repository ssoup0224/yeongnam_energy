"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { IconArrowRight, IconDoc, IconUser } from "./Icons";

/**
 * Signed-out personal block — sits in the same slot as the account summary
 * when logged in. The emergency SOS now lives in the hero, so this pairs a
 * sign-in invitation with a "getting started" guide for newcomers.
 */
export default function MyPanel() {
  const t = useT();

  return (
    <section
      aria-labelledby="my-title"
      className="shell grid grid-cols-1 gap-3 py-9 lg:grid-cols-2 lg:py-12"
    >
      {/* Sign-in */}
      <div className="relative overflow-hidden rounded-[1.25rem] border border-ink-200 bg-ink-900 p-6 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full sk-gradient opacity-25 blur-2xl"
        />
        <div className="relative">
          <h2 id="my-title" className="text-lg font-extrabold">
            {t("로그인하면 이번 달 요금이 바로 보입니다", "Sign in to see this month's bill at a glance")}
          </h2>
          <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-white/70">
            {t(
              "고객번호를 매번 입력하지 않아도 청구서와 납부 내역을 한 화면에서 확인하세요.",
              "No need to type your customer number each time — see your bills and payments in one place.",
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-[0.9375rem] font-extrabold text-ink-900 transition hover:bg-ink-100"
            >
              <IconUser className="size-4" /> {t("로그인", "Log in")}
            </Link>
            <Link
              href="/bill"
              className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-white/30 px-5 text-[0.9375rem] font-bold text-white transition hover:bg-white/10"
            >
              {t("비회원 조회", "Guest lookup")} <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Getting started */}
      <div className="flex flex-col rounded-[1.25rem] border border-ink-200 bg-white p-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-sk-orange-50 text-sk-orange-600">
          <IconDoc className="size-5" />
        </span>
        <h2 className="mt-3.5 text-lg font-extrabold text-ink-900">
          {t("무엇부터 해야 할지 모르겠다면", "Not sure where to start?")}
        </h2>
        <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-ink-500">
          {t(
            "메뉴 이름을 몰라도 괜찮습니다. 지금 상황을 고르면 처음부터 끝까지 순서대로 안내해 드립니다.",
            "No need to know the menu names — pick your situation and we'll walk you through it, step by step.",
          )}
        </p>
        <Link
          href="/guide"
          className="mt-auto inline-flex min-h-12 w-fit items-center gap-2 rounded-xl border-2 border-ink-200 px-5 text-[0.9375rem] font-bold text-ink-800 transition hover:border-sk-red-300 hover:bg-sk-red-50"
        >
          {t("상황별 안내 보기", "Browse guides by situation")} <IconArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
