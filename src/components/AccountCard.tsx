"use client";

import Link from "next/link";
import { pick, useLang, useT } from "@/lib/i18n";
import type { User } from "@/lib/auth";
import { IconArrowRight } from "./Icons";

const MONTHS_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Account-at-a-glance card for the hero (signed in). Merges the current
 * service address with this month's estimated bill so the number a customer
 * comes to check is the first thing they see.
 */
export default function AccountCard({ user }: { user: User }) {
  const { lang } = useLang();
  const t = useT();

  const bill = user.estimatedBill.toLocaleString("en-US");
  const due = new Date(user.dueDate);
  const dueLabel =
    lang === "en"
      ? `${MONTHS_EN[due.getMonth() + 1]} ${due.getDate()}, ${due.getFullYear()}`
      : `${due.getMonth() + 1}월 ${due.getDate()}일`;

  return (
    <aside className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 p-6 text-white lg:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full sk-gradient opacity-30 blur-2xl"
      />
      <div className="relative">
        {/* Address */}
        <p className="text-[0.8125rem] text-white/60">
          {t("현재 이용 중인 주소", "Current service address")}
        </p>
        <p className="mt-1.5 text-[1.0625rem] font-extrabold leading-snug sm:text-lg">
          {pick(user.address, lang)}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-white/70">
          <span>
            {t("고객번호", "Customer no.")}{" "}
            <span className="font-semibold text-white/90">{user.customerNo}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
            {pick(user.status, lang)}
          </span>
        </p>

        {/* This month's bill */}
        <div className="mt-5 border-t border-white/15 pt-5">
          <p className="text-[0.8125rem] text-white/60">
            {t("이번 달 예상 요금", "This month's estimate")}
          </p>
          <p className="mt-1 text-[2.25rem] font-extrabold tabular-nums leading-none tracking-tight sm:text-[2.75rem]">
            {lang === "en" ? `₩${bill}` : `${bill}원`}
          </p>
          <p className="mt-2 text-[0.8125rem] text-white/60">
            {t(`납부 예정일 ${dueLabel}`, `Due ${dueLabel}`)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/bill"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-5 text-[0.875rem] font-extrabold text-ink-900 transition hover:bg-ink-100"
          >
            {t("요금 상세 보기", "View bill")} <IconArrowRight className="size-4" />
          </Link>
          <Link
            href="/bill/account"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/30 px-5 text-[0.875rem] font-bold text-white transition hover:bg-white/10"
          >
            {t("계정 관리", "Manage account")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
