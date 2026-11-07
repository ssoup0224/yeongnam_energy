"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_ID, DEMO_PW, maskId, useAuth } from "@/lib/auth";
import { stamp } from "@/lib/data";
import { useT } from "@/lib/i18n";
import type { Verified } from "@/lib/verify";
import { Card, ErrorText, Field, inputCls, PrimaryButton } from "./form";
import { IconArrowRight, IconCheck, IconShield } from "./Icons";
import PassVerify from "./PassVerify";

type Tab = "id" | "pw";

export default function FindAccount() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("id");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-ink-100 p-1" role="tablist" aria-label={t("찾을 항목", "What to find")}>
        {(["id", "pw"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-12 rounded-xl text-[0.9375rem] font-extrabold transition ${tab === k ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
          >
            {k === "id" ? t("아이디 찾기", "Find ID") : t("비밀번호 재설정", "Reset password")}
          </button>
        ))}
      </div>
      {tab === "id" ? <FindId onReset={() => setTab("pw")} /> : <ResetPw />}
    </div>
  );
}

function FindId({ onReset }: { onReset: () => void }) {
  const t = useT();
  const { findIds } = useAuth();
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState<{ id: string; createdAt: string }[] | null>(null);

  return (
    <Card>
      {found === null ? (
        <>
          <p className="text-[0.9375rem] leading-relaxed text-ink-700">
            {t("가입할 때 인증한 휴대폰으로 본인확인을 하면 아이디를 알려 드립니다.", "Verify with the phone you signed up with and we'll show your ID.")}
          </p>
          <VerifyButton onClick={() => setOpen(true)} />
        </>
      ) : found.length ? (
        <div role="status">
          <p className="text-[0.9375rem] font-bold text-ink-900">{t("회원님 명의로 가입된 아이디입니다.", "IDs registered to you:")}</p>
          <ul className="mt-3 divide-y divide-ink-100 rounded-xl border border-ink-200">
            {found.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <strong data-found-id className="text-lg font-extrabold tracking-wide text-ink-900">{maskId(f.id)}</strong>
                <span className="text-[0.8125rem] tabular-nums text-ink-500">{t("가입", "Joined")} {stamp(f.createdAt).slice(0, 10)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.75rem] text-ink-500">{t("개인정보 보호를 위해 일부를 가렸습니다.", "Partly hidden to protect your account.")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/login" className="flex min-h-12 items-center justify-center gap-1 rounded-xl bg-ink-900 font-extrabold text-white">{t("로그인", "Log in")} <IconArrowRight className="size-4" /></Link>
            <button type="button" onClick={onReset} className="min-h-12 rounded-xl border-2 border-ink-200 font-bold text-ink-700">{t("비밀번호 재설정", "Reset password")}</button>
          </div>
        </div>
      ) : (
        <div role="status">
          <p className="text-[0.9375rem] font-bold text-ink-900">{t("인증하신 정보로 가입된 아이디가 없습니다.", "No account is registered to those details.")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/signup" className="flex min-h-12 items-center justify-center rounded-xl bg-ink-900 font-extrabold text-white">{t("회원가입", "Sign up")}</Link>
            <button type="button" onClick={() => setFound(null)} className="min-h-12 rounded-xl border-2 border-ink-200 font-bold text-ink-700">{t("다시 찾기", "Try again")}</button>
          </div>
        </div>
      )}
      <PassVerify
        open={open}
        mode="identity"
        purpose={{ ko: "아이디 찾기", en: "Find ID" }}
        onClose={() => setOpen(false)}
        onVerified={(v) => {
          setOpen(false);
          setFound(findIds(v.name, v.tel));
        }}
      />
    </Card>
  );
}

function ResetPw() {
  const t = useT();
  const { findIds, resetPassword } = useAuth();
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState<Verified | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const key = id.trim().toLowerCase();

  function start(e: React.FormEvent) {
    e.preventDefault();
    if (!key) return setErr({ "rp-id": t("아이디를 입력해 주세요.", "Enter your ID.") });
    if (key === DEMO_ID)
      return setErr({ "rp-id": t(`체험용 계정은 비밀번호를 바꿀 수 없습니다. (비밀번호: ${DEMO_PW})`, `The demo account's password can't be changed. (It's ${DEMO_PW}.)`) });
    setErr({});
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (pw.length < 8 || !/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) er["rp-pw"] = t("영문과 숫자를 섞어 8자 이상으로 정해 주세요.", "Use at least 8 characters with letters and numbers.");
    else if (pw.toLowerCase().includes(key)) er["rp-pw"] = t("비밀번호에 아이디를 넣을 수 없습니다.", "The password can't contain your ID.");
    if (pw2 !== pw) er["rp-pw2"] = t("비밀번호가 일치하지 않습니다.", "Passwords don't match.");
    setErr(er);
    if (Object.keys(er).length || !who) return;
    const res = await resetPassword(key, who.tel, pw);
    if (res !== "ok") return setErr({ "rp-pw": t("비밀번호를 바꾸지 못했습니다. 처음부터 다시 시도해 주세요.", "Couldn't change the password. Please start again.") });
    setDone(true);
  }

  if (done) {
    return (
      <Card className="text-center">
        <div role="status">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><IconCheck className="size-7" /></span>
          <p className="mt-3 text-lg font-extrabold text-ink-900">{t("비밀번호를 변경했습니다", "Password changed")}</p>
          <p className="mt-1 text-[0.875rem] text-ink-600">{t("새 비밀번호로 로그인해 주세요.", "Sign in with your new password.")}</p>
          <Link href="/login" className="mt-5 inline-flex min-h-12 items-center gap-1 rounded-xl bg-ink-900 px-6 font-extrabold text-white">{t("로그인", "Log in")} <IconArrowRight className="size-4" /></Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {!who ? (
        <form onSubmit={start} noValidate>
          <Field id="rp-id" label={t("아이디", "ID")} required error={err["rp-id"]}>
            <input id="rp-id" value={id} onChange={(e) => setId(e.target.value.toLowerCase())} autoComplete="username" className={inputCls(!!err["rp-id"])} />
          </Field>
          <p className="mt-3 text-[0.8125rem] text-ink-500">{t("가입할 때 인증한 휴대폰으로 본인확인을 진행합니다.", "You'll verify with the phone you signed up with.")}</p>
          <PrimaryButton className="mt-4 w-full"><IconShield className="size-[1.125rem]" /> {t("휴대폰 본인인증", "Verify with your phone")}</PrimaryButton>
        </form>
      ) : (
        <form onSubmit={save} noValidate className="space-y-4">
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[0.875rem] font-bold text-emerald-800">
            <IconCheck className="size-4" /> {t(`${maskId(key)} · 본인확인 완료`, `${maskId(key)} · identity confirmed`)}
          </p>
          <Field id="rp-pw" label={t("새 비밀번호", "New password")} required error={err["rp-pw"]} help={t("영문·숫자 포함 8자 이상", "8+ characters with letters and numbers")}>
            <input id="rp-pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className={inputCls(!!err["rp-pw"])} />
          </Field>
          <Field id="rp-pw2" label={t("새 비밀번호 확인", "Confirm new password")} required error={err["rp-pw2"]}>
            <input id="rp-pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" className={inputCls(!!err["rp-pw2"])} />
          </Field>
          <PrimaryButton className="w-full">{t("비밀번호 변경", "Change password")}</PrimaryButton>
        </form>
      )}
      {err.verify ? <ErrorText>{err.verify}</ErrorText> : null}
      <PassVerify
        open={open}
        mode="identity"
        purpose={{ ko: "비밀번호 재설정", en: "Password reset" }}
        onClose={() => setOpen(false)}
        onVerified={(v) => {
          setOpen(false);
          const owns = findIds(v.name, v.tel).some((f) => f.id.toLowerCase() === key);
          if (!owns) {
            setErr({ verify: t("인증한 정보와 아이디가 일치하지 않습니다. 아이디를 확인해 주세요.", "Those details don't match this ID. Please check the ID.") });
            return;
          }
          setErr({});
          setWho(v);
        }}
      />
    </Card>
  );
}

function VerifyButton({ onClick }: { onClick: () => void }) {
  const t = useT();
  return (
    <button type="button" onClick={onClick} className="mt-4 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 font-extrabold text-white hover:bg-ink-800">
      <IconShield className="size-[1.125rem]" /> {t("휴대폰 본인인증으로 찾기", "Find with phone verification")}
    </button>
  );
}
