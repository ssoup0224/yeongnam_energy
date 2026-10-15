import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";
import { T, type Bi } from "@/lib/i18n";
import {
  IconAlert,
  IconArrowRight,
  IconFlame,
  IconPhone,
  IconShield,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "가스 안전사용 요령",
  description: "가스 누출 시 행동요령과 평소 안전 점검 방법을 안내합니다.",
};

const EMERGENCY: { t: Bi; d: Bi }[] = [
  {
    t: { ko: "밸브를 잠그세요", en: "Close the valves" },
    d: { ko: "가스레인지 중간밸브와 계량기 밸브를 모두 잠급니다.", en: "Shut both the stove mid-valve and the meter valve." },
  },
  {
    t: { ko: "창문을 여세요", en: "Open the windows" },
    d: { ko: "환풍기·선풍기는 쓰지 말고 창문과 문을 열어 자연 환기합니다.", en: "Don't use fans — open windows and doors to ventilate naturally." },
  },
  {
    t: { ko: "전기는 만지지 마세요", en: "Don't touch electrics" },
    d: { ko: "스위치, 콘센트, 휴대폰 충전기 — 작은 불꽃도 위험합니다.", en: "Switches, outlets, phone chargers — even a tiny spark is dangerous." },
  },
  {
    t: { ko: "밖에서 신고하세요", en: "Report from outside" },
    d: { ko: `건물 밖으로 나온 뒤 ${SITE.safetyLine} 또는 119로 연락합니다.`, en: `Leave the building first, then call ${SITE.safetyLine} or 119.` },
  },
];

const HABITS: { t: Bi; d: Bi }[] = [
  {
    t: { ko: "사용 전", en: "Before use" },
    d: { ko: "가스 냄새가 나는지 확인하고, 창문을 열어 환기한 뒤 불을 켭니다.", en: "Check for a gas smell, ventilate, then light the flame." },
  },
  {
    t: { ko: "사용 중", en: "During use" },
    d: { ko: "파란 불꽃이 유지되는지 봅니다. 붉은 불꽃은 불완전연소 신호입니다.", en: "Keep the flame blue — a red flame signals incomplete combustion." },
  },
  {
    t: { ko: "사용 후", en: "After use" },
    d: { ko: "중간밸브까지 잠급니다. 장기간 집을 비울 땐 계량기 밸브도 잠급니다.", en: "Close the mid-valve; for long absences, close the meter valve too." },
  },
  {
    t: { ko: "매월 1회", en: "Once a month" },
    d: { ko: "비눗물을 연결부에 발라 거품이 생기는지 확인합니다.", en: "Brush soapy water on the joints and watch for bubbles." },
  },
];

const DONT: Bi[] = [
  { ko: "가스레인지 주변에 종이·행주·기름을 두지 마세요", en: "Don't keep paper, cloths or oil near the stove" },
  { ko: "호스를 개조하거나 임의로 늘이지 마세요", en: "Don't modify or extend the hose yourself" },
  { ko: "보일러 배기통이 빠지거나 찌그러졌는지 확인하세요", en: "Check the boiler flue isn't loose or dented" },
  { ko: "환기구를 옷장·가구로 막지 마세요", en: "Don't block vents with wardrobes or furniture" },
];

const RELATED: { label: Bi; href: string }[] = [
  { label: { ko: "가스시설 정기 점검 안내", en: "Regular facility inspection" }, href: "/safety/inspection" },
  { label: { ko: "안전점검 SMS 사전안내 신청", en: "Inspection SMS notice" }, href: "/safety/sms" },
  { label: { ko: "자가검침 입력하기", en: "Submit a self meter reading" }, href: "/safety/meter" },
  { label: { ko: "가스누출 신고 접수", en: "Report a gas leak" }, href: "/safety/report" },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        title={<T ko="가스 안전사용 요령" en="Safe gas-use tips" />}
        lead={
          <T
            ko="가스는 바르게 쓰면 안전합니다. 냄새가 날 때의 행동요령부터 먼저 확인하세요."
            en="Gas is safe when used correctly. Start with what to do if you smell it."
          />
        }
        crumbs={[
          { label: <T ko="안전·점검" en="Safety" />, href: "/safety" },
          { label: <T ko="가스 안전사용 요령" en="Safe Use Tips" /> },
        ]}
        tone="brand"
      />

      {/* Emergency */}
      <section aria-labelledby="emg" className="shell py-10 lg:py-14">
        <div className="rounded-[1.25rem] border-2 border-sk-red-300 bg-sk-red-50 p-5 lg:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-sk-red-500 px-3.5 py-1.5 text-[0.8125rem] font-extrabold text-white">
            <IconAlert className="size-4" /> <T ko="가스 냄새가 날 때" en="If you smell gas" />
          </p>
          <h2 id="emg" className="mt-3 text-xl font-extrabold text-ink-900 sm:text-2xl">
            <T ko="이 순서대로 하세요" en="Do this, in order" />
          </h2>

          <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EMERGENCY.map((s, i) => (
              <li key={s.t.ko} className="rounded-2xl border border-sk-red-200 bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-full sk-gradient text-[0.9375rem] font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3.5 text-[1rem] font-extrabold text-ink-900">
                  <T ko={s.t.ko} en={s.t.en} />
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-600">
                  <T ko={s.d.ko} en={s.d.en} />
                </p>
              </li>
            ))}
          </ol>

          <a
            href={`tel:${SITE.safetyLine}`}
            className="mt-5 flex min-h-15 items-center justify-center gap-3 rounded-xl bg-sk-red-500 px-6 py-4 text-xl font-extrabold text-white transition hover:bg-sk-red-600"
          >
            <IconPhone className="size-6" /> {SITE.safetyLine} <T ko="신고" en="report" />
          </a>
          <p className="mt-2 text-center text-[0.8125rem] text-ink-600">
            <T
              ko="24시간 연중무휴 · 화재·폭발 위험이 있으면 먼저 119"
              en="24/7, every day · for fire or explosion risk, call 119 first"
            />
          </p>
        </div>
      </section>

      {/* Daily habits */}
      <section aria-labelledby="habit" className="shell pb-10 lg:pb-14">
        <h2 id="habit" className="flex items-center gap-2 text-xl font-extrabold text-ink-900 sm:text-2xl">
          <IconShield className="size-6 text-sk-red-500" />
          <T ko="평소 이렇게 쓰세요" en="Everyday good habits" />
        </h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HABITS.map((h) => (
            <li key={h.t.ko} className="rounded-2xl border border-ink-200 bg-white p-5">
              <span className="inline-block rounded-full bg-ink-100 px-3 py-1 text-[0.75rem] font-extrabold text-ink-700">
                <T ko={h.t.ko} en={h.t.en} />
              </span>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-700">
                <T ko={h.d.ko} en={h.d.en} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Don'ts */}
      <section aria-labelledby="dont" className="shell pb-10 lg:pb-14">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
            <h2 id="dont" className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
              <IconFlame className="size-5 text-sk-orange-500" />
              <T ko="이것만은 피해주세요" en="Please avoid these" />
            </h2>
            <ul className="mt-4 space-y-3">
              {DONT.map((d) => (
                <li key={d.ko} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-sk-red-100 text-[0.6875rem] font-extrabold text-sk-red-600"
                  >
                    ✕
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-700">
                    <T ko={d.ko} en={d.en} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
            <h2 className="text-lg font-extrabold text-ink-900">
              <T ko="관련 안내" en="Related" />
            </h2>
            <ul className="mt-4 space-y-2">
              {RELATED.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex min-h-14 items-center gap-3 rounded-xl border border-ink-200 px-4 text-[0.9375rem] font-bold text-ink-800 transition hover:border-sk-red-300 hover:bg-sk-red-50"
                  >
                    <T ko={l.label.ko} en={l.label.en} />
                    <IconArrowRight className="ml-auto size-4 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
