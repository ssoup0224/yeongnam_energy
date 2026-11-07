"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DEMO_ID, DEMO_PW, MAX_PW_FAILS, useAuth } from "@/lib/auth";
import { pick, useT } from "@/lib/i18n";
import { inputCls, PrimaryButton } from "./form";
import { IconArrowRight, IconLock, IconShield, IconUser } from "./Icons";
import PassVerify from "./PassVerify";
import { SocialButtons } from "./SocialLogin";
import { PROVIDERS, savePendingSocial, type SocialProfile } from "@/lib/social";

/** Only allow same-site relative redirects. */
function safeNext(raw: string | null) {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

export default function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { checkCredentials, completeLogin, socialLogin } = useAuth();
  const t = useT();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Step 2: code to the member's registered phone.
  const [pending, setPending] = useState<{ memberId: string; tel: string; name: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim() || !pw) {
      setError(t("아이디와 비밀번호를 모두 입력해 주세요.", "Please enter both an ID and a password."));
      return;
    }
    setBusy(true);
    const res = await checkCredentials(id, pw);
    setBusy(false);
    if (res.status === "locked") {
      const min = Math.max(1, Math.ceil((res.until - Date.now()) / 60000));
      setError(
        t(
          `비밀번호를 ${MAX_PW_FAILS}회 잘못 입력해 로그인이 ${min}분간 제한됩니다. 비밀번호를 잊으셨다면 재설정해 주세요.`,
          `Too many wrong passwords — sign-in is paused for ${min} min. Forgot it? Reset your password.`,
        ),
      );
      setPw("");
      return;
    }
    if (res.status === "invalid") {
      setError(
        t(
          `아이디 또는 비밀번호가 올바르지 않습니다. (${res.failures}/${MAX_PW_FAILS}회 · ${MAX_PW_FAILS}회 틀리면 5분간 제한)`,
          `The ID or password is incorrect. (${res.failures}/${MAX_PW_FAILS} · 5-minute pause after ${MAX_PW_FAILS})`,
        ),
      );
      setPw("");
      return;
    }
    setError("");
    setPending({ memberId: res.memberId, tel: res.tel, name: res.name });
  }

  function onSocial(p: SocialProfile) {
    const res = socialLogin(p);
    if (res === "new") {
      savePendingSocial(p);
      router.push(`/signup?social=${p.provider}${next !== "/" ? `&next=${encodeURIComponent(next)}` : ""}`);
      return;
    }
    if (res === "linked") {
      try {
        sessionStorage.setItem("yes-flash", t(`${pick(PROVIDERS[p.provider].name, "ko")} 계정을 회원 정보와 연결했습니다.`, `Your ${pick(PROVIDERS[p.provider].name, "en")} account is now linked.`));
      } catch {}
    }
    router.push(next);
  }

  function fillDemo() {
    setId(DEMO_ID);
    setPw(DEMO_PW);
    setError("");
  }

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-md">
        {next !== "/" ? (
          <p className="mb-4 flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-3.5 text-[0.8125rem] text-ink-600">
            <IconLock className="size-4 shrink-0 text-ink-400" />
            {t("로그인이 필요한 화면입니다. 로그인하면 바로 이동합니다.", "This page needs you to sign in — you'll be taken there afterwards.")}
          </p>
        ) : null}

        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-6 lg:p-8">
          <h1 className="text-xl font-extrabold text-ink-900">{t("로그인", "Log in")}</h1>
          <p className="mt-1.5 text-[0.875rem] text-ink-500">
            {t("로그인하면 이번 달 요금과 신청 내역을 한 화면에서 볼 수 있습니다.", "Sign in to see this month's bill and your requests in one place.")}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="login-id" className="block text-[0.8125rem] font-bold text-ink-700">{t("아이디", "ID")}</label>
              <input id="login-id" name="id" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" className={`${inputCls(!!error)} mt-1.5`} />
            </div>
            <div>
              <label htmlFor="login-pw" className="block text-[0.8125rem] font-bold text-ink-700">{t("비밀번호", "Password")}</label>
              <input id="login-pw" name="password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" className={`${inputCls(!!error)} mt-1.5`} />
            </div>

            {error ? <p role="alert" className="text-[0.8125rem] font-semibold text-sk-red-600">{error}</p> : null}

            <PrimaryButton disabled={busy} className="w-full">
              <IconUser className="size-4" /> {busy ? t("확인 중…", "Checking…") : t("로그인", "Log in")}
            </PrimaryButton>
          </form>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.75rem] text-ink-500">
            <IconShield className="size-3.5" />
            {t("아이디로 로그인하면 등록된 휴대폰 인증번호를 한 번 더 확인합니다.", "ID sign-in also checks a code sent to your registered phone.")}
          </p>

          <div className="mt-6">
            <p className="relative text-center text-[0.75rem] font-bold text-ink-400 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[calc(50%-3.5rem)] before:bg-ink-200 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[calc(50%-3.5rem)] after:bg-ink-200">
              {t("간편 로그인", "Quick sign-in")}
            </p>
            <div className="mt-3">
              <SocialButtons onProfile={onSocial} />
            </div>
            <p className="mt-2 text-center text-[0.6875rem] text-ink-400">
              {t("데모 기능 · 실제 카카오·네이버와 연결되지 않습니다.", "Demo — not connected to Kakao or Naver.")}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-sk-orange-200 bg-sk-orange-50 p-3.5 text-[0.8125rem] text-sk-orange-800">
            <p>
              {t("체험용 계정", "Demo account")}: <strong className="tabular-nums">{DEMO_ID}</strong> / <strong className="tabular-nums">{DEMO_PW}</strong>
            </p>
            <button type="button" onClick={fillDemo} className="mt-1.5 font-bold underline underline-offset-2">
              {t("체험용 계정으로 채우기", "Fill in the demo account")}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-ink-100 pt-5 text-[0.8125rem]">
            <Link href="/find-account" className="font-bold text-ink-700 hover:text-sk-red-600 hover:underline">
              {t("아이디·비밀번호 찾기", "Find ID / password")}
            </Link>
            <span className="h-3 w-px bg-ink-200" aria-hidden />
            <Link href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-ink-700 hover:text-sk-red-600 hover:underline">
              {t("회원가입", "Sign up")}
            </Link>
            <span className="h-3 w-px bg-ink-200" aria-hidden />
            <Link href="/bill/quick" className="inline-flex items-center gap-1 font-bold text-ink-700 hover:text-sk-red-600 hover:underline">
              {t("비회원 요금조회", "Guest bill lookup")} <IconArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <PassVerify
        open={!!pending}
        mode="otp"
        purpose={{ ko: "로그인 2단계 인증", en: "Sign-in verification" }}
        tel={pending?.tel}
        name={pending?.name}
        onClose={() => setPending(null)}
        onVerified={() => {
          if (!pending) return;
          completeLogin(pending.memberId);
          setPending(null);
          router.push(next);
        }}
      />
    </div>
  );
}
