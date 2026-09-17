import Link from "next/link";
import { BUSINESS } from "@/lib/site";
import {
  IconArrowRight,
  IconBattery,
  IconFlame,
  IconLeaf,
  IconSnow,
  IconTruck,
} from "./Icons";

const ICONS = {
  "city-gas": IconFlame,
  "fuel-cell": IconBattery,
  "gas-cooling": IconSnow,
  renewable: IconLeaf,
  cng: IconTruck,
} as const;

export default function BusinessAreas() {
  return (
    <section aria-labelledby="biz-title" className="border-y border-ink-200 bg-white">
      <div className="shell py-12 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="biz-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
              사업 소개
            </h2>
            <p className="mt-1.5 text-sm text-ink-500">
              포항과 함께 성장하는 영남에너지서비스의 다섯 가지 에너지 사업입니다.
            </p>
          </div>
          <Link
            href="/about"
            className="hidden shrink-0 items-center gap-1 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-ink-300 sm:inline-flex"
          >
            회사소개 <IconArrowRight className="size-4" />
          </Link>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {BUSINESS.map((b) => {
            const Icon = ICONS[b.id as keyof typeof ICONS];
            return (
              <li key={b.id}>
                <Link
                  href={`/about#${b.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink-200 p-5 transition hover:-translate-y-0.5 hover:border-sk-orange-300 hover:bg-sk-orange-50/50"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition group-hover:bg-sk-orange-500 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <span className="mt-4 text-base font-extrabold text-ink-900">{b.name}</span>
                  <span className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-500">
                    {b.desc}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
