"use client";

import { useState } from "react";
import {
  calcBill,
  CALORIFIC,
  CERT_KINDS,
  currentPeriod,
  dateLabel,
  digitsOnly,
  formatCustomerNo,
  LIBRARY,
  lookupAccount,
  periodLabel,
  PRESS,
  QNA_CATEGORIES,
  QNA_SEED,
  STANDARD_CALORIFIC,
  stamp,
  tariffById,
  won,
  type LibraryDoc,
} from "@/lib/data";
import { pick, useLang, useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore, type Certificate } from "@/lib/store";
import { printArea } from "@/lib/print";
import { useAccountView } from "@/lib/useAccountView";
import RequestForm from "../RequestForm";
import {
  Card,
  Checkbox,
  ErrorText,
  Field,
  focusFirstError,
  InfoBox,
  inputCls,
  isCustomerNo,
  isTel,
  PrimaryButton,
  RadioCards,
  SampleNote,
  SectionTitle,
} from "../form";
import { IconChevron, IconDownload, IconLock, IconPrint, IconSearch } from "../Icons";

/* ═══ 서식·증명 발급 ═════════════════════════════════════════════ */

/** The six billing periods we hold data for (oldest → newest). */
function availablePeriods() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

export function Certificates() {
  const t = useT();
  const { lang } = useLang();
  const { user, ready } = useAuth();
  const { state, addCertificate } = useStore();
  const periods = availablePeriods();
  const [kind, setKind] = useState("");
  const [no, setNo] = useState<string | null>(null);
  const [from, setFrom] = useState(periods[0]);
  const [to, setTo] = useState(periods[periods.length - 1]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [issued, setIssued] = useState<Certificate | null>(null);

  if (!ready) return <div className="min-h-64" aria-hidden />;
  const customer = no ?? user?.customerNo ?? "";
  const needsPeriod = kind === "usage" || kind === "paid";

  function issue(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!kind) er.kind = t("증명서 종류를 선택해 주세요.", "Choose a certificate.");
    if (!isCustomerNo(customer)) er.certNo = t("고객번호 10자리를 입력해 주세요.", "Enter a 10-digit customer number.");
    else if (!lookupAccount(customer)) er.certNo = t("등록되지 않은 고객번호입니다.", "That customer number isn't registered.");
    if (needsPeriod && from > to) er.period = t("시작 월이 종료 월보다 늦습니다.", "The start month is after the end month.");
    setErrors(er);
    if (Object.keys(er).length) return focusFirstError(er);
    const rec = addCertificate({ kind, customerNo: digitsOnly(customer), from: needsPeriod ? from : "", to: needsPeriod ? to : "" });
    setIssued(rec);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (issued) {
    return (
      <div className="space-y-4">
        <CertificateDoc c={issued} own={!!user && user.customerDigits === issued.customerNo} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <PrimaryButton type="button" onClick={printArea} className="flex-1"><IconPrint className="size-5" /> {t("인쇄 / PDF로 저장", "Print / save as PDF")}</PrimaryButton>
          <button type="button" onClick={() => setIssued(null)} className="min-h-13 rounded-xl border-2 border-ink-200 px-6 font-bold text-ink-700">{t("다른 증명서 발급", "Issue another")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={issue} noValidate className="space-y-4">
        <Card>
          <SectionTitle>{t("증명서 종류", "Certificate")}</SectionTitle>
          <div data-field="kind">
            <RadioCards name="cert-kind" columns={2} value={kind} onChange={setKind} invalid={!!errors.kind} options={CERT_KINDS.map((c) => ({ value: c.id, label: c.label, sub: c.desc }))} />
            {errors.kind ? <ErrorText>{errors.kind}</ErrorText> : null}
          </div>
        </Card>
        <Card>
          <SectionTitle>{t("발급 대상", "Details")}</SectionTitle>
          <div className="space-y-5">
            <Field id="certNo" label={t("고객번호", "Customer number")} required error={errors.certNo} help={user ? t("회원님 고객번호로 채웠습니다.", "Filled with your customer number.") : t("체험용: 1234-567-890", "Demo: 1234-567-890")}>
              <input id="certNo" value={customer} inputMode="numeric" onChange={(e) => setNo(e.target.value)} className={inputCls(!!errors.certNo)} placeholder="1234-567-890" />
            </Field>
            {needsPeriod ? (
              <div data-field="period">
                <p className="text-[0.875rem] font-bold text-ink-800">{t("대상 기간", "Period")}</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label className="text-[0.8125rem] text-ink-600">
                    {t("시작", "From")}
                    <select id="cert-from" value={from} onChange={(e) => setFrom(e.target.value)} className={`${inputCls(!!errors.period)} mt-1`}>
                      {periods.map((p) => <option key={p} value={p}>{periodLabel(p, lang)}</option>)}
                    </select>
                  </label>
                  <label className="text-[0.8125rem] text-ink-600">
                    {t("종료", "To")}
                    <select id="cert-to" value={to} onChange={(e) => setTo(e.target.value)} className={`${inputCls(!!errors.period)} mt-1`}>
                      {periods.map((p) => <option key={p} value={p}>{periodLabel(p, lang)}</option>)}
                    </select>
                  </label>
                </div>
                {errors.period ? <ErrorText>{errors.period}</ErrorText> : null}
              </div>
            ) : null}
          </div>
        </Card>
        <PrimaryButton className="w-full">{t("즉시 발급", "Issue now")}</PrimaryButton>
      </form>

      {state.certificates.length ? (
        <Card>
          <SectionTitle>{t("최근 발급 내역", "Recently issued")}</SectionTitle>
          <ul className="divide-y divide-ink-100">
            {state.certificates.slice(0, 5).map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => setIssued(c)} className="flex w-full items-center gap-3 py-3 text-left hover:opacity-80">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-bold text-ink-900">{pick(CERT_KINDS.find((k) => k.id === c.kind)!.label, lang)}</span>
                    <span className="block text-[0.8125rem] tabular-nums text-ink-500">{c.id} · {stamp(c.createdAt)}</span>
                  </span>
                  <IconPrint className="size-4 text-ink-400" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function CertificateDoc({ c, own }: { c: Certificate; own: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const { isPaid } = useStore();
  // Same source as the statement: this month uses any submitted self-reading,
  // discounts and the actually-paid amount.
  const view = useAccountView(c.customerNo, own);
  const a = lookupAccount(c.customerNo)!;
  const kind = CERT_KINDS.find((k) => k.id === c.kind)!;
  const periods = availablePeriods().filter((p) => (c.from ? p >= c.from && p <= c.to : true));
  const now = currentPeriod();
  const rows = periods.map((p) => {
    const month = Number(p.slice(5));
    const usage = view?.usage ?? a.usage;
    const u = usage.find((x) => x.month === month)?.value ?? 0;
    const amount = p === now && view ? view.bill.total : calcBill(u, a.tariffId).total;
    const paid = p === now ? isPaid(a.customerNo, p) : true;
    return { p, u, amount, paid };
  });
  const paidRows = rows.filter((r) => r.paid);
  const outstanding = !isPaid(a.customerNo, now);

  return (
    <div className="print-area fade-up rounded-[1.25rem] border-2 border-ink-900 bg-white p-6 lg:p-10">
      <div className="flex items-start justify-between gap-4 border-b-2 border-ink-900 pb-4">
        <div>
          <p className="text-[0.75rem] tabular-nums text-ink-500">{t("발급번호", "No.")} <span data-cert-id>{c.id}</span></p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">{pick(kind.label, lang)}</h2>
        </div>
        <p className="text-right text-[0.75rem] text-ink-500">{t("발급일", "Issued")}<br /><strong className="text-ink-800">{dateLabel(c.createdAt, lang)}</strong></p>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-[0.875rem] sm:grid-cols-2">
        {[
          [t("고객번호", "Customer no."), formatCustomerNo(a.customerNo)],
          [t("사용자", "Holder"), pick(own ? a.holderFull : a.holder, lang)],
          [t("사용 주소", "Address"), pick(a.address, lang)],
          [t("용도", "Usage type"), pick(tariffById(a.tariffId).label, lang)],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3"><dt className="w-20 shrink-0 text-ink-500">{k}</dt><dd className="font-bold text-ink-900">{v}</dd></div>
        ))}
      </dl>

      {c.kind === "usage" || c.kind === "paid" ? (
        <table className="mt-6 w-full text-left text-[0.875rem]">
          <thead>
            <tr className="border-y border-ink-300 text-[0.75rem] text-ink-500">
              <th className="py-2 font-semibold">{t("기간", "Period")}</th>
              {c.kind === "usage" ? <th className="py-2 text-right font-semibold">{t("사용량", "Usage")}</th> : null}
              <th className="py-2 text-right font-semibold">{c.kind === "usage" ? t("청구금액", "Billed") : t("납부금액", "Paid")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {(c.kind === "paid" ? paidRows : rows).map((r) => (
              <tr key={r.p}>
                <td className="py-2">{periodLabel(r.p, lang)}</td>
                {c.kind === "usage" ? <td className="py-2 text-right tabular-nums">{r.u}㎥</td> : null}
                <td className="py-2 text-right font-bold tabular-nums">{won(r.amount, lang)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink-900">
              <td className="py-2 font-extrabold">{t("합계", "Total")}</td>
              {c.kind === "usage" ? <td className="py-2 text-right font-extrabold tabular-nums">{rows.reduce((s, r) => s + r.u, 0)}㎥</td> : null}
              <td data-cert-total className="py-2 text-right font-extrabold tabular-nums">{won((c.kind === "paid" ? paidRows : rows).reduce((s, r) => s + r.amount, 0), lang)}</td>
            </tr>
          </tfoot>
        </table>
      ) : null}

      <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-800">
        {c.kind === "clear"
          ? outstanding
            ? t(`위 고객은 ${periodLabel(now, lang)} 청구분이 납기 전 미납 상태이며, 그 이전 요금은 모두 납부하였음을 증명합니다.`, `The above customer has paid all charges before ${periodLabel(now, lang)}; the ${periodLabel(now, lang)} bill is not yet due.`)
            : t("위 고객은 현재까지 청구된 도시가스 요금을 모두 납부하였음을 증명합니다.", "This certifies the above customer has paid all city-gas charges billed to date.")
          : c.kind === "contract"
            ? t(`위 고객은 ${dateLabel(a.contractDate, lang)}부터 당사와 도시가스 사용계약을 맺고 사용 중임을 확인합니다.`, `This confirms the above customer has held a supply contract with us since ${dateLabel(a.contractDate, lang)}.`)
            : t("위와 같이 확인합니다.", "Certified as above.")}
      </p>
      <div className="mt-8 flex items-end justify-between gap-4">
        <p className="text-[0.75rem] text-ink-400">{t("발급번호로 진위를 확인할 수 있습니다 · 1800-0098", "Verify with the issue number · 1800-0098")}</p>
        <div className="text-right">
          <p className="font-extrabold text-ink-900">{t("영남에너지서비스 대표이사", "Yeongnam Energy Service, CEO")}</p>
          <span aria-hidden className="ml-auto mt-1 flex size-14 items-center justify-center whitespace-pre-line rounded-md border-2 border-sk-red-500 text-center text-[0.625rem] font-extrabold leading-tight text-sk-red-500">
            {t("영남에너지\n서비스", "YES\nseal")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══ 열량계수 조회 ══════════════════════════════════════════════ */

export function Calorific() {
  const t = useT();
  const { lang } = useLang();
  const [usage, setUsage] = useState("30");
  const latest = CALORIFIC[CALORIFIC.length - 1];
  const coef = (v: number) => v / STANDARD_CALORIFIC;
  const max = Math.max(...CALORIFIC.map((c) => c.value));
  const min = Math.min(...CALORIFIC.map((c) => c.value));
  const u = Number(usage) || 0;

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle sub={t(`기준열량 ${STANDARD_CALORIFIC} MJ/㎥ 대비 실제 공급된 가스의 열량 비율입니다.`, `The ratio of the actual heat value supplied to the standard ${STANDARD_CALORIFIC} MJ/㎥.`)}>
          {t("이번 달 열량계수", "This month's coefficient")}
        </SectionTitle>
        <p data-coef className="text-4xl font-extrabold tabular-nums text-ink-900">{coef(latest.value).toFixed(4)}</p>
        <p className="mt-1 text-[0.875rem] text-ink-500">{periodLabel(latest.period, lang)} · {latest.value.toFixed(2)} MJ/㎥</p>
      </Card>

      <Card>
        <SectionTitle>{t("월별 열량계수", "By month")}</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-left text-[0.875rem]">
            <thead>
              <tr className="border-b border-ink-200 text-[0.75rem] text-ink-500">
                <th className="py-2 font-semibold">{t("월", "Month")}</th>
                <th className="py-2 text-right font-semibold">{t("공급열량 (MJ/㎥)", "Heat value (MJ/㎥)")}</th>
                <th className="py-2 text-right font-semibold">{t("열량계수", "Coefficient")}</th>
                <th className="w-32 py-2" aria-hidden />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {[...CALORIFIC].reverse().map((c) => (
                <tr key={c.period}>
                  <td className="py-2.5 font-semibold">{periodLabel(c.period, lang)}</td>
                  <td className="py-2.5 text-right tabular-nums">{c.value.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-bold tabular-nums">{coef(c.value).toFixed(4)}</td>
                  <td className="py-2.5 pl-3" aria-hidden>
                    <span className="block h-2 rounded-full sk-gradient" style={{ width: `${20 + ((c.value - min) / (max - min || 1)) * 80}%` }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle sub={t("요금은 계량기 사용량에 열량계수를 곱한 '보정 사용량'으로 계산됩니다.", "Charges use the 'corrected volume': metered usage × coefficient.")}>{t("보정 사용량 계산", "Corrected volume")}</SectionTitle>
        <Field id="cal-usage" label={t("계량기 사용량 (㎥)", "Metered usage (㎥)")}>
          <input id="cal-usage" value={usage} inputMode="numeric" onChange={(e) => setUsage(e.target.value.replace(/\D/g, "").slice(0, 4))} className={inputCls()} />
        </Field>
        <p className="mt-4 rounded-xl bg-ink-50 p-4 text-[0.9375rem] text-ink-800" aria-live="polite">
          {u}㎥ × {coef(latest.value).toFixed(4)} = <strong data-corrected className="text-lg tabular-nums text-ink-900">{(u * coef(latest.value)).toFixed(2)}㎥</strong>
        </p>
      </Card>
      <SampleNote />
    </div>
  );
}

/* ═══ 온라인 상담 (Q&A) ══════════════════════════════════════════ */

type QnaRow = {
  id: string;
  createdAt: string;
  category: string;
  title: string;
  body: string;
  author: string;
  isPrivate: boolean;
  answer?: string;
  mine: boolean;
};

export function Qna() {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const { state, addQna } = useStore();
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);

  const rows: QnaRow[] = [
    ...state.qna.map((p) => ({ ...p, mine: true })),
    ...QNA_SEED.map((s) => ({ id: s.id, createdAt: s.createdAt, category: s.category, title: pick(s.title, lang), body: pick(s.body, lang), author: pick(s.author, lang), isPrivate: false, answer: pick(s.answer, lang), mine: false })),
  ];
  const needle = q.trim().toLowerCase();
  const shown = rows.filter((r) => (tab === "all" || r.mine) && (!needle || r.title.toLowerCase().includes(needle)));
  const catLabel = (id: string) => pick(QNA_CATEGORIES.find((c) => c.id === id)?.label ?? { ko: id, en: id }, lang);

  return (
    <div className="space-y-4">
      {writing ? (
        <QnaForm
          defaultName={user ? pick(user.name, lang) : ""}
          onCancel={() => setWriting(false)}
          onSubmit={(p) => {
            const rec = addQna(p);
            setWriting(false);
            setTab("mine");
            setOpen(rec.id);
          }}
        />
      ) : (
        <PrimaryButton type="button" onClick={() => setWriting(true)} className="w-full">{t("상담 글쓰기", "Ask a question")}</PrimaryButton>
      )}

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" className="flex gap-1 rounded-xl bg-ink-50 p-1">
            {(["all", "mine"] as const).map((k) => (
              <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-10 rounded-lg px-4 text-[0.875rem] font-bold ${tab === k ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}>
                {k === "all" ? t("전체", "All") : t(`내 문의 (${state.qna.length})`, `Mine (${state.qna.length})`)}
              </button>
            ))}
          </div>
          <label className="relative ml-auto flex-1 sm:max-w-xs">
            <span className="sr-only">{t("제목 검색", "Search titles")}</span>
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder={t("제목 검색", "Search titles")} className="min-h-10 w-full rounded-lg border border-ink-200 pl-9 pr-3 text-[0.875rem]" />
          </label>
        </div>

        <ul className="mt-4 divide-y divide-ink-100">
          {shown.map((r) => (
            <li key={r.id} data-qna={r.id}>
              <button type="button" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)} className="flex w-full items-start gap-3 py-4 text-left">
                <span className="mt-0.5 shrink-0 rounded-md bg-ink-100 px-2 py-0.5 text-[0.6875rem] font-extrabold text-ink-600">{catLabel(r.category)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[0.9375rem] font-bold text-ink-900">
                    {r.isPrivate ? <IconLock className="size-3.5 shrink-0 text-ink-400" /> : null}
                    <span className="truncate">{r.title}</span>
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] text-ink-500">{r.author} · {stamp(r.createdAt)}</span>
                </span>
                <span data-qna-status className={`shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-extrabold ${r.answer ? "bg-emerald-50 text-emerald-700" : "bg-sk-orange-100 text-sk-orange-700"}`}>
                  {r.answer ? t("답변 완료", "Answered") : t("답변 대기", "Awaiting reply")}
                </span>
              </button>
              {open === r.id ? (
                <div className="fade-up space-y-3 pb-5 pl-1">
                  <p className="whitespace-pre-wrap rounded-xl bg-ink-50 p-4 text-[0.875rem] leading-relaxed text-ink-700">{r.body}</p>
                  {r.answer ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                      <p className="text-[0.75rem] font-extrabold text-emerald-700">{t("고객센터 답변", "Our reply")}</p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-800">{r.answer}</p>
                    </div>
                  ) : (
                    <p className="text-[0.8125rem] text-ink-500">{t("1영업일 안에 답변드리며, 답변이 등록되면 문자로 알려드립니다.", "We reply within one business day and will text you when we do.")}</p>
                  )}
                </div>
              ) : null}
            </li>
          ))}
          {shown.length === 0 ? (
            <li className="py-10 text-center text-[0.875rem] text-ink-500">{tab === "mine" ? t("작성한 문의가 없습니다.", "You haven't asked anything yet.") : t("검색 결과가 없습니다.", "No results.")}</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}

function QnaForm({
  defaultName,
  onSubmit,
  onCancel,
}: {
  defaultName: string;
  onSubmit: (p: { category: string; title: string; body: string; author: string; isPrivate: boolean }) => void;
  onCancel: () => void;
}) {
  const t = useT();
  const { lang } = useLang();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(defaultName);
  const [tel, setTel] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!category) er["qna-cat"] = t("분류를 선택해 주세요.", "Choose a category.");
    if (title.trim().length < 4) er["qna-title"] = t("제목을 4자 이상 입력해 주세요.", "Enter a title of at least 4 characters.");
    if (body.trim().length < 10) er["qna-body"] = t("내용을 10자 이상 입력해 주세요.", "Enter at least 10 characters.");
    if (author.trim().length < 2) er["qna-author"] = t("이름을 입력해 주세요.", "Enter your name.");
    if (tel && !isTel(tel)) er["qna-tel"] = t("연락처 형식을 확인해 주세요.", "Check the phone format.");
    setErrors(er);
    if (Object.keys(er).length) return focusFirstError(er);
    const masked = author.trim().length > 1 ? `${author.trim()[0]}*${author.trim().slice(-1)}` : author.trim();
    onSubmit({ category, title: title.trim(), body: body.trim(), author: masked, isPrivate });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card className="fade-up">
        <SectionTitle>{t("상담 글쓰기", "Ask a question")}</SectionTitle>
        <div className="space-y-5">
          <Field id="qna-cat" label={t("분류", "Category")} required error={errors["qna-cat"]}>
            <select id="qna-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls(!!errors["qna-cat"])}>
              <option value="">{t("선택해 주세요", "Select…")}</option>
              {QNA_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{pick(c.label, lang)}</option>)}
            </select>
          </Field>
          <Field id="qna-title" label={t("제목", "Title")} required error={errors["qna-title"]}>
            <input id="qna-title" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} className={inputCls(!!errors["qna-title"])} />
          </Field>
          <Field id="qna-body" label={t("내용", "Question")} required error={errors["qna-body"]} help={t("고객번호·계좌번호 같은 개인정보는 적지 마세요.", "Don't include customer or account numbers.")}>
            <textarea id="qna-body" value={body} maxLength={1000} rows={6} onChange={(e) => setBody(e.target.value)} className={`${inputCls(!!errors["qna-body"])} min-h-36 resize-y`} />
            <p className="mt-1 text-right text-[0.75rem] tabular-nums text-ink-400">{body.length} / 1000</p>
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="qna-author" label={t("이름", "Name")} required error={errors["qna-author"]} help={t("목록에는 가운데 글자가 가려져 보입니다.", "Shown masked in the list.")}>
              <input id="qna-author" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls(!!errors["qna-author"])} />
            </Field>
            <Field id="qna-tel" label={t("답변 알림 연락처 (선택)", "Phone for reply alert (optional)")} error={errors["qna-tel"]}>
              <input id="qna-tel" value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" className={inputCls(!!errors["qna-tel"])} />
            </Field>
          </div>
          <Checkbox checked={isPrivate} onChange={setPrivate}>{t("비공개로 작성 (본인과 담당자만 볼 수 있음)", "Private (only you and our staff can read it)")}</Checkbox>
          <div className="flex gap-2">
            <PrimaryButton className="flex-1">{t("등록하기", "Post")}</PrimaryButton>
            <button type="button" onClick={onCancel} className="min-h-13 rounded-xl border-2 border-ink-200 px-6 font-bold text-ink-700">{t("취소", "Cancel")}</button>
          </div>
        </div>
      </Card>
    </form>
  );
}

/* ═══ 자료실 ═════════════════════════════════════════════════════ */

function downloadDoc(doc: LibraryDoc, lang: "ko" | "en") {
  const title = pick(doc.title, lang);
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font-family:"Pretendard","Apple SD Gothic Neo","Malgun Gothic",sans-serif;max-width:720px;margin:48px auto;padding:0 24px;line-height:1.75;color:#11151d}h1{font-size:24px;border-bottom:2px solid #11151d;padding-bottom:12px}.meta{color:#6b7280;font-size:13px}p{margin:14px 0}</style></head>
<body><h1>${esc(title)}</h1><p class="meta">${lang === "en" ? "Yeongnam Energy Service · Updated" : "영남에너지서비스 · 개정"} ${doc.updated}</p>
${doc.body.map((b) => `<p>${esc(pick(b, lang))}</p>`).join("\n")}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.id}-${lang}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Library() {
  const t = useT();
  const { lang } = useLang();
  const cats = Array.from(new Map(LIBRARY.map((d) => [d.cat.ko, d.cat])).values());
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const shown = LIBRARY.filter((d) => !cat || d.cat.ko === cat);

  return (
    <Card>
      <div className="flex flex-wrap gap-2">
        {[{ ko: "", en: "" }, ...cats].map((c) => (
          <button key={c.ko || "all"} type="button" aria-pressed={cat === c.ko} onClick={() => setCat(c.ko)} className={`min-h-10 rounded-full border px-4 text-[0.875rem] font-bold ${cat === c.ko ? "border-transparent bg-ink-900 text-white" : "border-ink-200 text-ink-600"}`}>
            {c.ko ? pick(c, lang) : t("전체", "All")}
          </button>
        ))}
      </div>
      <ul className="mt-4 divide-y divide-ink-100">
        {shown.map((d) => (
          <li key={d.id} data-doc={d.id} className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[0.6875rem] font-extrabold text-ink-600">{pick(d.cat, lang)}</span>
              <button type="button" aria-expanded={open === d.id} onClick={() => setOpen(open === d.id ? null : d.id)} className="min-w-0 flex-1 text-left text-[0.9375rem] font-bold text-ink-900 hover:underline">
                {pick(d.title, lang)}
              </button>
              <span className="text-[0.75rem] tabular-nums text-ink-400">{d.updated}</span>
              <button type="button" onClick={() => downloadDoc(d, lang)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-[0.8125rem] font-bold text-ink-700 hover:bg-ink-50">
                <IconDownload className="size-4" /> {t("내려받기", "Download")}
              </button>
            </div>
            {open === d.id ? (
              <div className="fade-up mt-3 space-y-2 rounded-xl bg-ink-50 p-4 text-[0.875rem] leading-relaxed text-ink-700">
                {d.body.map((b, i) => <p key={i}>{pick(b, lang)}</p>)}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ═══ 보도자료 ═══════════════════════════════════════════════════ */

export function Press() {
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState<string | null>(PRESS[0].id);
  return (
    <div className="space-y-4">
      <Card>
        <ul className="divide-y divide-ink-100">
          {PRESS.map((p) => (
            <li key={p.id} data-press={p.id}>
              <button type="button" aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)} className="flex w-full items-start gap-3 py-4 text-left">
                <time dateTime={p.date} className="mt-0.5 shrink-0 text-[0.8125rem] tabular-nums text-ink-400">{p.date.replaceAll("-", ".")}</time>
                <span className="min-w-0 flex-1 text-[1rem] font-extrabold leading-snug text-ink-900">{pick(p.title, lang)}</span>
                <IconChevron className={`mt-1 size-4 shrink-0 text-ink-400 transition ${open === p.id ? "rotate-90" : ""}`} />
              </button>
              {open === p.id ? (
                <div className="fade-up space-y-3 pb-5 text-[0.9375rem] leading-relaxed text-ink-700">
                  {p.body.map((b, i) => <p key={i}>{pick(b, lang)}</p>)}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>
      <p className="text-[0.75rem] text-ink-400">{t("※ 리디자인 시안용 예시 기사입니다.", "※ Sample articles for the redesign draft.")}</p>
    </div>
  );
}

/* ═══ SK 윤리경영 상담·제보 ══════════════════════════════════════ */

export function Ethics() {
  const t = useT();
  return (
    <div className="space-y-4">
      <InfoBox>
        <p className="font-bold text-ink-900">{t("제보자 보호 원칙", "How we protect you")}</p>
        <ul className="mt-1.5 space-y-1">
          <li>· {t("제보자의 신원과 제보 내용은 비밀로 보장됩니다.", "Your identity and report are kept confidential.")}</li>
          <li>· {t("제보를 이유로 한 어떠한 불이익도 금지됩니다.", "Retaliation for reporting is prohibited.")}</li>
          <li>· {t("익명 제보도 접수되며, 접수번호로 진행 상황을 문의할 수 있습니다.", "Anonymous reports are accepted; follow up with your reference number.")}</li>
        </ul>
      </InfoBox>
      <RequestForm
        type="ethics"
        anonymousOption
        applicant={{ customerNo: false, hideAddress: true }}
        sections={[
          {
            title: { ko: "제보 내용", en: "Report" },
            fields: [
              {
                name: "category",
                kind: "select",
                required: true,
                label: { ko: "유형", en: "Type" },
                options: [
                  { value: "bribe", label: { ko: "금품·향응 수수", en: "Bribery / gifts" } },
                  { value: "abuse", label: { ko: "부당한 지시·압력", en: "Improper instruction" } },
                  { value: "harass", label: { ko: "직장 내 괴롭힘", en: "Workplace harassment" } },
                  { value: "fraud", label: { ko: "회계 부정·횡령", en: "Fraud / embezzlement" } },
                  { value: "other", label: { ko: "기타", en: "Other" } },
                ],
              },
              { name: "subject", kind: "text", label: { ko: "대상 (부서·이름)", en: "Who (team / name)" } },
              { name: "when", kind: "date", label: { ko: "발생일", en: "When" } },
              {
                name: "detail",
                kind: "textarea",
                required: true,
                maxLength: 2000,
                label: { ko: "내용", en: "What happened" },
                validate: (v) => (v.trim().length < 20 ? { ko: "구체적인 내용을 20자 이상 적어 주세요.", en: "Please give at least 20 characters of detail." } : null),
              },
              { name: "evidence", kind: "file", multiple: true, accept: ".pdf,.jpg,.jpeg,.png", label: { ko: "증빙자료 (선택)", en: "Evidence (optional)" } },
            ],
          },
        ]}
        consent={{ ko: "제보 내용은 윤리경영 조사 목적으로만 쓰이며, 조사 종료 후 관계 법령이 정한 기간까지 보관됩니다.", en: "Reports are used only for ethics investigations and kept for the period required by law." }}
        submitLabel={{ ko: "제보하기", en: "Submit report" }}
        successNote={{ ko: "접수번호를 꼭 보관해 주세요. 진행 상황은 접수번호로 윤리경영 담당(054-280-5114)에 문의할 수 있습니다.", en: "Keep your reference number — use it to ask the ethics team (054-280-5114) about progress." }}
      />
    </div>
  );
}
