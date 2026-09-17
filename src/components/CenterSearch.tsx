"use client";

import { useMemo, useState } from "react";
import { CENTERS } from "@/lib/site";
import { IconAlert, IconCenter, IconPhone, IconSearch } from "./Icons";

const DONG = [
  "전체", "상도동", "해도동", "송도동", "죽도동", "용흥동", "양덕동",
  "오천읍", "흥해읍", "구룡포읍", "호미곶면",
];

export default function CenterSearch() {
  const [q, setQ] = useState("");
  const [dong, setDong] = useState("전체");

  const results = useMemo(() => {
    const needle = q.trim();
    return CENTERS.filter((c) => {
      const byDong = dong === "전체" || c.area.includes(dong.replace(/[읍면동]$/, ""));
      const byQ =
        !needle ||
        c.name.includes(needle) ||
        c.area.includes(needle) ||
        c.addr.includes(needle);
      return byDong && byQ;
    });
  }, [q, dong]);

  return (
    <div>
      <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
        <h2 className="text-lg font-extrabold text-ink-900">센터 찾기</h2>
        <p className="mt-1.5 text-[0.875rem] text-ink-500">
          동네 이름이나 센터 이름으로 검색하거나, 아래에서 지역을 선택하세요.
        </p>

        <div className="mt-4">
          <label htmlFor="center-q" className="sr-only">
            동네 이름 또는 센터 이름 검색
          </label>
          <div className="flex items-center gap-2 rounded-xl border-2 border-ink-200 bg-white px-3 focus-within:border-sk-red-500">
            <IconSearch className="size-5 shrink-0 text-ink-400" />
            <input
              id="center-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예) 오천읍, 양덕동"
              className="min-h-13 min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-ink-300"
            />
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-[0.875rem] font-bold text-ink-800">지역 선택</legend>
          <ul className="no-scrollbar mt-2.5 flex flex-wrap gap-2">
            {DONG.map((d) => (
              <li key={d}>
                <button
                  type="button"
                  onClick={() => setDong(d)}
                  aria-pressed={dong === d}
                  className={`min-h-11 rounded-full border px-4 text-[0.875rem] font-bold transition
                    ${dong === d
                      ? "border-transparent bg-ink-900 text-white"
                      : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"}`}
                >
                  {d}
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <p className="mt-6 text-[0.875rem] font-bold text-ink-700" aria-live="polite">
        검색 결과 <span className="text-sk-red-600">{results.length}</span>곳
      </p>

      {results.length === 0 ? (
        <div className="mt-3 flex flex-col items-center rounded-[1.25rem] border border-dashed border-ink-300 bg-white p-10 text-center">
          <IconAlert className="size-8 text-ink-300" />
          <p className="mt-3 text-base font-extrabold text-ink-900">
            조건에 맞는 센터를 찾지 못했습니다
          </p>
          <p className="mt-1.5 text-[0.875rem] text-ink-500">
            검색어를 지우거나 &lsquo;전체&rsquo;를 선택해 보세요.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setDong("전체");
            }}
            className="mt-5 min-h-12 rounded-xl bg-ink-900 px-6 text-[0.9375rem] font-bold text-white hover:bg-ink-800"
          >
            검색 조건 초기화
          </button>
        </div>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((c) => (
            <li
              key={c.name}
              className="flex flex-col rounded-[1.25rem] border border-ink-200 bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sk-red-50 text-sk-red-600">
                  <IconCenter className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1rem] font-extrabold text-ink-900">{c.name}</h3>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-500">
                    담당 지역 · {c.area}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[0.875rem] text-ink-600">{c.addr}</p>
              <a
                href={`tel:${c.tel}`}
                className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-ink-200 text-[0.9375rem] font-extrabold tabular-nums text-ink-900 transition hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
              >
                <IconPhone className="size-4" /> {c.tel}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
