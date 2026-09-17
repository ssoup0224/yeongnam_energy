import Link from "next/link";
import { CENTERS } from "@/lib/site";
import { IconArrowRight, IconCenter, IconPhone } from "./Icons";

export default function CenterFinder() {
  return (
    <section aria-labelledby="center-title" className="shell py-10 lg:py-14">
      <div className="overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr]">
          <div className="relative overflow-hidden sk-gradient p-6 text-white lg:p-9">
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 size-72 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <IconCenter className="size-8" />
              <h2 id="center-title" className="mt-4 text-xl font-extrabold sm:text-2xl">
                우리 동네
                <br />
                서비스센터 찾기
              </h2>
              <p className="mt-3 max-w-xs text-[0.875rem] leading-relaxed text-white/85">
                읍·면·동을 선택하면 담당 센터의 위치와 직통번호를 바로
                확인할 수 있습니다.
              </p>
              <Link
                href="/centers"
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-[0.9375rem] font-extrabold text-sk-red-600 transition hover:bg-ink-50"
              >
                센터 검색하기 <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <ul className="divide-y divide-ink-100">
            {CENTERS.slice(0, 4).map((c) => (
              <li key={c.name}>
                <Link
                  href="/centers"
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-ink-50 lg:px-7"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-extrabold text-ink-900">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-ink-500">
                      {c.area}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-50 px-3 py-2 text-[0.8125rem] font-bold tabular-nums text-ink-700">
                    <IconPhone className="size-3.5" />
                    {c.tel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
