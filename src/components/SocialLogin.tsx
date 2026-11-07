"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { pick, useLang, useT } from "@/lib/i18n";
import { maskTel } from "@/lib/verify";
import { maskEmail, MOCK_ACCOUNTS, PROVIDERS, type Provider, type SocialProfile } from "@/lib/social";
import { IconChevron, IconClose } from "./Icons";

/* Provider marks drawn per each brand's login-button guidelines. */
export function KakaoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3.5c-5.25 0-9.5 3.33-9.5 7.44 0 2.66 1.78 5 4.46 6.31-.15.52-.94 3.3-.97 3.52 0 0-.02.16.09.22.1.06.23.01.23.01.3-.04 3.47-2.27 4.02-2.66.54.08 1.1.12 1.67.12 5.25 0 9.5-3.33 9.5-7.44S17.25 3.5 12 3.5z" />
    </svg>
  );
}

export function NaverMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M5 4h4.7l4.9 7.1V4H19v16h-4.7l-4.9-7.1V20H5z" />
    </svg>
  );
}

/** Kakao + Naver buttons. `onProfile` gets the consented mock profile. */
export function SocialButtons({ onProfile, variant = "login" }: { onProfile: (p: SocialProfile) => void; variant?: "login" | "signup" }) {
  const { lang } = useLang();
  const [open, setOpen] = useState<Provider | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        {(["kakao", "naver"] as const).map((p) => {
          const P = PROVIDERS[p];
          return (
            <button
              key={p}
              type="button"
              data-social={p}
              onClick={() => setOpen(p)}
              style={{ backgroundColor: P.bg, color: P.fg }}
              className="relative flex min-h-13 w-full items-center justify-center rounded-xl px-12 text-[0.9375rem] font-bold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {p === "kakao" ? <KakaoMark className="size-5" /> : <NaverMark className="size-5" />}
              </span>
              {pick(variant === "login" ? P.button : P.start, lang)}
            </button>
          );
        })}
      </div>
      {open ? (
        <ProviderSheet
          provider={open}
          onClose={() => setOpen(null)}
          onDone={(prof) => {
            setOpen(null);
            onProfile(prof);
          }}
        />
      ) : null}
    </>
  );
}

const SCOPES = [
  { id: "name", required: true, label: { ko: "이름", en: "Name" } },
  { id: "tel", required: true, label: { ko: "휴대폰 번호", en: "Phone number" } },
  { id: "email", required: false, label: { ko: "이메일", en: "Email" } },
] as const;

function ProviderSheet({ provider, onClose, onDone }: { provider: Provider; onClose: () => void; onDone: (p: SocialProfile) => void }) {
  const t = useT();
  const { lang } = useLang();
  const P = PROVIDERS[provider];
  const box = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"account" | "consent" | "loading">("account");
  const [pickIdx, setPickIdx] = useState<number | null>(null);
  const [agree, setAgree] = useState<Record<string, boolean>>({ name: true, tel: true, email: true });
  const [openScope, setOpenScope] = useState(false);
  const [err, setErr] = useState("");
  const acct = pickIdx === null ? null : MOCK_ACCOUNTS[provider][pickIdx];
  const providerName = pick(P.name, lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "loading") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, step]);

  useEffect(() => {
    box.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [step]);

  function cont() {
    if (!acct) return;
    if (!SCOPES.every((s) => !s.required || agree[s.id])) {
      setErr(t("필수 항목에 동의해야 계속할 수 있습니다.", "Please agree to the required items to continue."));
      return;
    }
    setStep("loading");
    window.setTimeout(() => {
      onDone({ provider, sub: acct.sub, name: acct.name, tel: acct.tel, email: agree.email ? acct.email : undefined });
    }, 900);
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="social-title">
      <button type="button" tabIndex={-1} aria-label={t("닫기", "Close")} className="absolute inset-0 bg-ink-900/60" onClick={() => step !== "loading" && onClose()} />
      <div ref={box} className="fade-up relative flex max-h-[92vh] w-full max-w-[24rem] flex-col overflow-hidden rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.25rem]">
        <div className="flex items-center gap-2.5 px-5 py-4" style={{ backgroundColor: P.bg, color: P.fg }}>
          {provider === "kakao" ? <KakaoMark className="size-6" /> : <NaverMark className="size-6" />}
          <p id="social-title" className="flex-1 text-[1rem] font-extrabold">
            {t(`${providerName} 계정으로 로그인`, `Sign in with ${providerName}`)}
          </p>
          {step !== "loading" ? (
            <button type="button" onClick={onClose} aria-label={t("닫기", "Close")} className="flex size-9 items-center justify-center rounded-full hover:bg-black/10">
              <IconClose className="size-5" />
            </button>
          ) : null}
        </div>
        <p className="bg-ink-900 px-5 py-2 text-center text-[0.75rem] font-bold text-white">
          {t(`데모 화면 · 실제 ${providerName}와 연결되지 않으며 비밀번호를 묻지 않습니다`, `Demo screen · not connected to ${providerName}, never asks for a password`)}
        </p>

        <div className="overflow-y-auto px-5 pb-6 pt-5">
          {step === "account" ? (
            <>
              <p className="text-[0.9375rem] font-bold text-ink-900">{t("로그인할 계정을 선택하세요", "Choose an account")}</p>
              <ul className="mt-3 space-y-2">
                {MOCK_ACCOUNTS[provider].map((a, i) => (
                  <li key={a.sub}>
                    <button
                      type="button"
                      data-autofocus={i === 0 ? true : undefined}
                      data-account={a.sub}
                      onClick={() => {
                        setPickIdx(i);
                        setErr("");
                        setStep("consent");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border-2 border-ink-200 p-3.5 text-left transition hover:border-ink-400"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[0.9375rem] font-extrabold text-ink-700">{a.name.slice(0, 1)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.9375rem] font-bold text-ink-900">{a.name}</span>
                        <span className="block truncate text-[0.8125rem] text-ink-500">{maskEmail(a.email)}</span>
                        <span className="mt-0.5 block text-[0.75rem] font-bold text-sk-orange-700">{pick(a.note, lang)}</span>
                      </span>
                      <IconChevron className="size-4 shrink-0 text-ink-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {step === "consent" && acct ? (
            <>
              <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[0.9375rem] font-extrabold text-ink-700">{acct.name.slice(0, 1)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-bold text-ink-900">{acct.name}</p>
                  <p className="truncate text-[0.8125rem] text-ink-500">{maskEmail(acct.email)}</p>
                </div>
                <button type="button" onClick={() => setStep("account")} className="min-h-9 rounded-lg px-2 text-[0.75rem] font-bold text-ink-600 underline underline-offset-2">
                  {t("계정 변경", "Switch")}
                </button>
              </div>

              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-800">
                <strong className="font-extrabold">{t("영남에너지서비스", "Yeongnam Energy Service")}</strong>
                {t("에서 아래 정보 제공을 요청합니다.", " is asking for the following:")}
              </p>
              <div className="mt-3 rounded-xl border border-ink-200">
                <label className="flex min-h-12 cursor-pointer items-center gap-2.5 border-b border-ink-100 px-3.5">
                  <input
                    type="checkbox"
                    checked={SCOPES.every((s) => agree[s.id])}
                    onChange={(e) => {
                      setAgree(Object.fromEntries(SCOPES.map((s) => [s.id, e.target.checked])));
                      setErr("");
                    }}
                    className="size-5 accent-ink-900"
                  />
                  <span className="text-[0.875rem] font-extrabold text-ink-900">{t("전체 동의하기", "Agree to all")}</span>
                </label>
                <ul className="px-3.5 py-1.5">
                  {SCOPES.map((s) => (
                    <li key={s.id} className="flex min-h-10 items-center gap-2.5">
                      <input
                        id={`scope-${s.id}`}
                        type="checkbox"
                        checked={!!agree[s.id]}
                        onChange={(e) => {
                          setAgree({ ...agree, [s.id]: e.target.checked });
                          setErr("");
                        }}
                        className="size-4 accent-ink-900"
                      />
                      <label htmlFor={`scope-${s.id}`} className="flex-1 cursor-pointer text-[0.8125rem] text-ink-700">
                        <span className={s.required ? "font-bold text-sk-red-600" : "font-bold text-ink-400"}>{s.required ? t("[필수] ", "[Required] ") : t("[선택] ", "[Optional] ")}</span>
                        {pick(s.label, lang)}
                        <span className="ml-1 text-ink-400">
                          {s.id === "name" ? acct.name : s.id === "tel" ? maskTel(acct.tel) : maskEmail(acct.email)}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-expanded={openScope}
                  onClick={() => setOpenScope((v) => !v)}
                  className="flex min-h-10 w-full items-center justify-between border-t border-ink-100 px-3.5 text-[0.75rem] font-bold text-ink-500"
                >
                  {t("제공 목적 · 보유 기간 보기", "Purpose and retention")}
                  <IconChevron className={`size-3 transition ${openScope ? "-rotate-90" : "rotate-90"}`} />
                </button>
                {openScope ? (
                  <p className="px-3.5 pb-3 text-[0.75rem] leading-relaxed text-ink-600">
                    {t(
                      "회원 식별과 로그인, 요금·신청 안내에 사용하며 회원 탈퇴 시 즉시 파기합니다. 동의하지 않으면 간편 로그인을 이용할 수 없습니다.",
                      "Used to identify you, sign you in and send bill/request notices; deleted when you leave. Without consent you can't use quick sign-in.",
                    )}
                  </p>
                ) : null}
              </div>
              {err ? <p role="alert" className="mt-2 text-[0.8125rem] font-semibold text-sk-red-600">{err}</p> : null}
              <button
                type="button"
                data-autofocus
                onClick={cont}
                style={{ backgroundColor: P.bg, color: P.fg }}
                className="mt-4 flex min-h-13 w-full items-center justify-center rounded-xl text-base font-extrabold transition hover:brightness-95"
              >
                {t("동의하고 계속하기", "Agree and continue")}
              </button>
              <button type="button" onClick={onClose} className="mt-2 min-h-11 w-full rounded-xl text-[0.875rem] font-bold text-ink-500 hover:bg-ink-50">
                {t("취소", "Cancel")}
              </button>
            </>
          ) : null}

          {step === "loading" ? (
            <div className="flex flex-col items-center py-8" role="status">
              <span className="size-10 animate-spin rounded-full border-4 border-ink-200" style={{ borderTopColor: provider === "kakao" ? "#3c1e1e" : P.bg }} aria-hidden />
              <p className="mt-4 text-[0.9375rem] font-bold text-ink-700">{t("영남에너지서비스로 돌아가는 중…", "Returning to Yeongnam Energy Service…")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
