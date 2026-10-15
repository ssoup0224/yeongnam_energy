"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { IconArrowRight, IconShield, IconUser } from "./Icons";

/**
 * Mock sign-in. Any non-empty id/password "logs in" as the demo customer —
 * there is no server and no real credential check. It exists only to show the
 * personalized home dashboard.
 */
export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const t = useT();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [touched, setTouched] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim() || !pw.trim()) {
      setTouched(true);
      return;
    }
    login();
    router.push("/");
  }

  const invalid = touched && (!id.trim() || !pw.trim());

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-md">
        {/* Demo notice */}
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-sk-orange-200 bg-sk-orange-50 p-3.5 text-[0.8125rem] leading-relaxed text-sk-orange-800">
          <IconShield className="mt-0.5 size-4 shrink-0" />
          <span>
            {t(
              "데모 로그인입니다. 아이디·비밀번호에 아무 값이나 입력하면 예시 고객 계정으로 로그인됩니다.",
              "This is a demo login. Enter anything for ID and password to sign in as a sample customer.",
            )}
          </span>
        </p>

        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-6 lg:p-8">
          <h1 className="text-xl font-extrabold text-ink-900">{t("로그인", "Log in")}</h1>
          <p className="mt-1.5 text-[0.875rem] text-ink-500">
            {t(
              "로그인하면 이번 달 요금과 신청 내역을 한 화면에서 볼 수 있습니다.",
              "Sign in to see this month's bill and your requests in one place.",
            )}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="login-id" className="block text-[0.8125rem] font-bold text-ink-700">
                {t("아이디 또는 고객번호", "ID or customer number")}
              </label>
              <input
                id="login-id"
                name="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                className="mt-1.5 min-h-12 w-full rounded-xl border-2 border-ink-200 bg-white px-4 text-base text-ink-900 outline-none placeholder:text-ink-400 focus:border-sk-red-500"
                placeholder={t("예: hong123 또는 1234-5678", "e.g. hong123 or 1234-5678")}
              />
            </div>

            <div>
              <label htmlFor="login-pw" className="block text-[0.8125rem] font-bold text-ink-700">
                {t("비밀번호", "Password")}
              </label>
              <input
                id="login-pw"
                name="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="current-password"
                className="mt-1.5 min-h-12 w-full rounded-xl border-2 border-ink-200 bg-white px-4 text-base text-ink-900 outline-none placeholder:text-ink-400 focus:border-sk-red-500"
                placeholder={t("아무 값이나 입력하세요", "Type anything")}
              />
            </div>

            {invalid ? (
              <p role="alert" className="text-[0.8125rem] font-semibold text-sk-red-600">
                {t("아이디와 비밀번호를 모두 입력해 주세요.", "Please enter both an ID and a password.")}
              </p>
            ) : null}

            <button
              type="submit"
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl sk-gradient px-5 text-base font-extrabold text-white transition hover:brightness-95"
            >
              <IconUser className="size-4" />
              {t("로그인", "Log in")}
              <IconArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-3 border-t border-ink-100 pt-5 text-[0.8125rem]">
            <Link href="/signup" className="font-bold text-ink-700 hover:text-sk-red-600 hover:underline">
              {t("회원가입", "Sign up")}
            </Link>
            <span className="h-3 w-px bg-ink-200" aria-hidden />
            <Link href="/bill" className="font-bold text-ink-700 hover:text-sk-red-600 hover:underline">
              {t("비회원 요금조회", "Guest bill lookup")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
