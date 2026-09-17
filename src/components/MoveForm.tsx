"use client";

import { useState } from "react";
import { IconAlert, IconArrowRight, IconShield } from "./Icons";

const STEPS = ["신청 정보", "방문 일정", "확인 및 접수"] as const;

type Kind = "in" | "out";

export default function MoveForm({ kind }: { kind: Kind }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [addr, setAddr] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const label = kind === "in" ? "전입신청" : "전출신청";

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!name.trim()) e.name = "신청인 성함을 입력해 주세요.";
      if (!/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(tel.replace(/\s/g, "")))
        e.tel = "연락처를 010-0000-0000 형식으로 입력해 주세요.";
      if (!addr.trim()) e.addr = "주소를 입력해 주세요.";
    }
    if (s === 1) {
      if (!date) e.date = "방문 희망일을 선택해 주세요.";
      if (!slot) e.slot = "방문 희망 시간대를 선택해 주세요.";
    }
    if (s === 2 && !agree) e.agree = "개인정보 수집·이용에 동의해 주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    if (step < 2) setStep(step + 1);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="fade-up rounded-[1.25rem] border border-ink-200 bg-white p-8 text-center lg:p-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-sk-red-50 text-sk-red-600">
          <IconShield className="size-8" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold text-ink-900 sm:text-2xl">
          {label}이 접수되었습니다
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
          접수번호 <strong className="font-extrabold tabular-nums text-ink-900">P-26091701</strong>
          <br />
          담당 서비스센터에서 <strong className="font-bold text-ink-900">{tel}</strong>로
          방문 일정을 확정 안내드립니다.
        </p>

        <dl className="mx-auto mt-6 max-w-md divide-y divide-ink-100 rounded-2xl border border-ink-200 text-left">
          {[
            ["신청 구분", label],
            ["신청인", name],
            ["주소", addr],
            ["방문 희망", `${date} ${slot}`],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 px-4 py-3.5">
              <dt className="w-24 shrink-0 text-[0.875rem] text-ink-500">{k}</dt>
              <dd className="min-w-0 flex-1 text-[0.875rem] font-bold text-ink-900">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-[0.8125rem] text-ink-500">
          접수 내역은 &lsquo;방문예약 확인·변경&rsquo;에서 다시 보실 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-8">
      {/* Progress */}
      <ol className="flex items-center gap-2" aria-label="신청 단계">
        {STEPS.map((s, i) => (
          <li key={s} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              aria-current={i === step ? "step" : undefined}
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-extrabold transition
                ${i < step
                  ? "bg-ink-900 text-white"
                  : i === step
                    ? "sk-gradient text-white"
                    : "bg-ink-100 text-ink-400"}`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span
              className={`truncate text-[0.8125rem] font-bold ${
                i === step ? "text-ink-900" : "text-ink-400"
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <span className={`h-0.5 min-w-3 flex-1 rounded ${i < step ? "bg-ink-900" : "bg-ink-200"}`} aria-hidden />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-7">
        {step === 0 && (
          <div className="space-y-5">
            <Field
              id="mf-name"
              label="신청인 성함"
              required
              error={errors.name}
              help="가스 사용계약자 본인 이름을 입력하세요."
            >
              <input
                id="mf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={inputCls(!!errors.name)}
                placeholder="예) 홍길동"
              />
            </Field>

            <Field
              id="mf-tel"
              label="연락처"
              required
              error={errors.tel}
              help="방문 일정 확정 안내를 문자로 보내드립니다."
            >
              <input
                id="mf-tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                className={inputCls(!!errors.tel)}
                placeholder="예) 010-1234-5678"
              />
            </Field>

            <Field
              id="mf-addr"
              label={kind === "in" ? "이사 들어갈 주소" : "이사 나갈 주소"}
              required
              error={errors.addr}
              help="동·호수까지 정확히 적어주시면 방문이 빨라집니다."
            >
              <input
                id="mf-addr"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                autoComplete="street-address"
                className={inputCls(!!errors.addr)}
                placeholder="예) 포항시 남구 대이로 89, 101동 1203호"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <Field
              id="mf-date"
              label="방문 희망일"
              required
              error={errors.date}
              help={
                kind === "out"
                  ? "이사 3일 전까지 신청하시면 원하는 날짜에 방문할 수 있습니다."
                  : "가스 사용 개시일 기준으로 선택하세요."
              }
            >
              <input
                id="mf-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls(!!errors.date)}
              />
            </Field>

            <fieldset>
              <legend className="text-[0.875rem] font-bold text-ink-800">
                방문 희망 시간대 <span className="text-sk-red-600">(필수)</span>
              </legend>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {["오전 09–12시", "오후 13–15시", "오후 15–18시"].map((s) => (
                  <label
                    key={s}
                    className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-3 text-center text-[0.875rem] font-bold transition
                      ${slot === s
                        ? "border-sk-red-500 bg-sk-red-50 text-sk-red-700"
                        : "border-ink-200 text-ink-700 hover:border-ink-300"}`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s}
                      checked={slot === s}
                      onChange={() => setSlot(s)}
                      className="sr-only"
                    />
                    {s}
                  </label>
                ))}
              </div>
              {errors.slot && <ErrorText id="slot-err">{errors.slot}</ErrorText>}
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-base font-extrabold text-ink-900">입력하신 내용을 확인해 주세요</h2>
            <dl className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-200">
              {[
                ["신청 구분", label],
                ["신청인", name],
                ["연락처", tel],
                ["주소", addr],
                ["방문 희망", `${date} ${slot}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 px-4 py-3.5">
                  <dt className="w-24 shrink-0 text-[0.875rem] text-ink-500">{k}</dt>
                  <dd className="min-w-0 flex-1 text-[0.875rem] font-bold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 p-4 hover:bg-ink-50">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[#EA002C]"
              />
              <span className="text-[0.875rem] leading-relaxed text-ink-700">
                <strong className="font-extrabold text-ink-900">개인정보 수집·이용 동의</strong>
                <span className="text-sk-red-600"> (필수)</span>
                <br />
                성함·연락처·주소는 방문 일정 안내와 사용계약 처리 목적으로만 쓰이며,
                처리 완료 후 관계 법령이 정한 기간까지 보관됩니다.
              </span>
            </label>
            {errors.agree && <ErrorText id="agree-err">{errors.agree}</ErrorText>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-2 border-t border-ink-100 pt-6 sm:flex-row">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="min-h-13 rounded-xl border-2 border-ink-200 px-6 text-base font-bold text-ink-700 transition hover:border-ink-300"
          >
            이전
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl sk-gradient px-6 text-base font-extrabold text-white transition hover:brightness-95"
        >
          {step === 2 ? "신청 접수하기" : "다음 단계"}
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function inputCls(bad: boolean) {
  return `min-h-13 w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink-900 outline-none transition
    placeholder:text-ink-300 focus:border-sk-red-500
    ${bad ? "border-sk-red-500 bg-sk-red-50/40" : "border-ink-200"}`;
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-bold text-sk-red-600"
    >
      <IconAlert className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  required,
  help,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.875rem] font-bold text-ink-800">
        {label}
        {required && <span className="text-sk-red-600"> (필수)</span>}
      </label>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-[0.8125rem] text-ink-500">
          {help}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && <ErrorText id={`${id}-err`}>{error}</ErrorText>}
    </div>
  );
}
