"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { dateLabel } from "@/lib/data";
import { InfoBox } from "../form";

type Section = { id: string; title: Bi; body: (Bi | { list: Bi[] })[] };

function LegalDoc({ effective, sections, note }: { effective: string; sections: Section[]; note?: ReactNode }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <article className="space-y-6">
      <p className="text-[0.875rem] text-ink-500">{t(`시행일 ${dateLabel(effective, lang)}`, `Effective ${dateLabel(effective, lang)}`)}</p>
      {note}
      <nav aria-label={t("목차", "Contents")} className="rounded-[1.25rem] border border-ink-200 bg-white p-5">
        <p className="text-[0.8125rem] font-extrabold text-ink-500">{t("목차", "Contents")}</p>
        <ol className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-flex min-h-9 items-center text-[0.875rem] font-semibold text-ink-700 hover:text-sk-red-600 hover:underline">
                {i + 1}. {pick(s.title, lang)}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28 rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
            <h2 className="text-lg font-extrabold text-ink-900">
              {t(`제${i + 1}조 `, `Art. ${i + 1} `)}
              {pick(s.title, lang)}
            </h2>
            <div className="mt-3 space-y-2.5 text-[0.9375rem] leading-relaxed text-ink-700">
              {s.body.map((b, j) =>
                "list" in b ? (
                  <ul key={j} className="list-disc space-y-1 pl-5">
                    {b.list.map((x, k) => <li key={k}>{pick(x, lang)}</li>)}
                  </ul>
                ) : (
                  <p key={j}>{pick(b, lang)}</p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

/* ═══ 이용약관 ═══════════════════════════════════════════════════ */

const TERMS: Section[] = [
  { id: "t1", title: { ko: "목적", en: "Purpose" }, body: [{ ko: "이 약관은 영남에너지서비스(이하 '회사')가 제공하는 홈페이지 서비스의 이용 조건과 절차, 회사와 이용자의 권리·의무를 정함을 목적으로 합니다.", en: "These terms set out the conditions and procedures for using Yeongnam Energy Service's website ('the Company'), and the rights and duties of the Company and users." }] },
  { id: "t2", title: { ko: "정의", en: "Definitions" }, body: [{ list: [
    { ko: "'이용자'란 홈페이지에 접속하여 서비스를 이용하는 회원 및 비회원을 말합니다.", en: "'User' means any member or guest using the website." },
    { ko: "'회원'이란 고객번호를 연결하여 회원가입을 한 이용자를 말합니다.", en: "'Member' means a user who has registered with a linked customer number." },
    { ko: "'고객번호'란 도시가스 사용계약에 부여된 10자리 번호를 말합니다.", en: "'Customer number' means the 10-digit number assigned to a supply contract." },
  ] }] },
  { id: "t3", title: { ko: "약관의 효력과 변경", en: "Effect and changes" }, body: [{ ko: "회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 시행일 7일 전(이용자에게 불리한 경우 30일 전)부터 홈페이지에 공지합니다.", en: "The Company may amend these terms within the law, giving notice on the website 7 days before they take effect (30 days if unfavourable to users)." }] },
  { id: "t4", title: { ko: "회원가입", en: "Membership" }, body: [{ ko: "회원가입은 이용자가 약관과 개인정보 수집·이용에 동의하고 유효한 고객번호를 연결함으로써 성립합니다. 타인의 정보를 도용한 경우 가입이 취소될 수 있습니다.", en: "Membership is formed when a user agrees to these terms and the privacy notice and links a valid customer number. Using someone else's details may void the membership." }] },
  { id: "t5", title: { ko: "탈퇴 및 자격 상실", en: "Leaving and loss of membership" }, body: [{ ko: "회원은 언제든지 마이페이지 또는 고객센터를 통해 탈퇴할 수 있습니다. 회사는 회원이 약관을 위반한 경우 사전 통지 후 자격을 제한할 수 있습니다.", en: "Members may leave at any time via My Page or the customer center. The Company may restrict a member who breaches these terms after giving notice." }] },
  { id: "t6", title: { ko: "서비스의 제공", en: "Services" }, body: [{ list: [
    { ko: "요금 조회·납부, 자동이체·청구서 변경", en: "Bill lookup and payment, auto-pay and bill-type changes" },
    { ko: "전입·전출 등 각종 신청과 방문 예약", en: "Move-in/out and other requests, visit booking" },
    { ko: "자가검침, 안전점검 안내, 증명서 발급", en: "Self meter reading, inspection notices, certificates" },
  ] }, { ko: "정기 점검 등 불가피한 경우 서비스가 일시 중단될 수 있으며, 회사는 이를 사전에 공지합니다.", en: "Services may be briefly suspended for maintenance, with notice in advance." }] },
  { id: "t7", title: { ko: "회원의 의무", en: "Members' duties" }, body: [{ ko: "회원은 아이디와 비밀번호를 스스로 관리해야 하며, 이를 제3자에게 알려서는 안 됩니다. 정보가 바뀐 경우 즉시 수정해야 합니다.", en: "Members must keep their ID and password safe, never share them, and keep their details up to date." }] },
  { id: "t8", title: { ko: "면책", en: "Liability" }, body: [{ ko: "회사는 천재지변, 이용자의 귀책사유 등 회사의 고의·과실이 없는 사유로 발생한 손해에 대해서는 책임을 지지 않습니다.", en: "The Company is not liable for losses not caused by its intent or negligence, such as natural disasters or the user's own fault." }] },
  { id: "t9", title: { ko: "분쟁 해결", en: "Disputes" }, body: [{ ko: "서비스 이용과 관련한 분쟁은 상호 협의로 해결하며, 협의가 되지 않을 경우 회사 소재지 관할 법원을 관할 법원으로 합니다.", en: "Disputes are settled by consultation; failing that, the court with jurisdiction over the Company's address has jurisdiction." }] },
];

export function Terms() {
  return <LegalDoc effective="2026-07-01" sections={TERMS} />;
}

/* ═══ 개인정보처리방침 ═══════════════════════════════════════════ */

const PRIVACY: Section[] = [
  { id: "p1", title: { ko: "수집하는 개인정보 항목", en: "What we collect" }, body: [{ list: [
    { ko: "회원가입: 아이디, 비밀번호, 이름, 휴대폰 번호, 이메일, 고객번호", en: "Sign-up: ID, password, name, mobile, email, customer number" },
    { ko: "각종 신청: 신청인 이름, 연락처, 주소, 방문 희망 일시, 첨부 서류", en: "Requests: applicant name, phone, address, preferred visit time, attachments" },
    { ko: "자동이체: 금융기관명, 계좌·카드번호, 예금주, 생년월일", en: "Auto-pay: institution, account or card number, holder, date of birth" },
  ] }] },
  { id: "p2", title: { ko: "수집·이용 목적", en: "Why we use it" }, body: [{ ko: "요금 청구·수납, 신청 처리와 방문 안내, 안전점검 안내, 민원 응대, 법령상 의무 이행을 위해서만 이용합니다.", en: "Only for billing and collection, processing requests and arranging visits, safety-inspection notices, handling enquiries, and legal obligations." }] },
  { id: "p3", title: { ko: "보유 및 이용 기간", en: "How long we keep it" }, body: [{ list: [
    { ko: "회원 정보: 탈퇴 시까지", en: "Member details: until you leave" },
    { ko: "요금 청구·납부 기록: 5년 (전자상거래법)", en: "Billing and payment records: 5 years (E-Commerce Act)" },
    { ko: "민원·상담 기록: 3년", en: "Enquiry records: 3 years" },
  ] }] },
  { id: "p4", title: { ko: "제3자 제공", en: "Sharing with third parties" }, body: [{ ko: "법령에 근거가 있거나 정보주체가 동의한 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다. 가스 사고 시 한국가스안전공사에 사고 처리에 필요한 최소 정보를 제공할 수 있습니다.", en: "We share personal data only where the law requires it or you consent. In a gas incident, minimal information may go to the Korea Gas Safety Corporation." }] },
  { id: "p5", title: { ko: "처리 위탁", en: "Processors" }, body: [{ list: [
    { ko: "지역 서비스센터: 방문 신청 처리, 안전점검", en: "Local service centers: visit requests, inspections" },
    { ko: "결제대행사: 카드·간편결제 처리", en: "Payment processors: card and easy-pay" },
    { ko: "메시지 발송 대행사: 알림톡·문자 발송", en: "Messaging provider: notifications and texts" },
  ] }] },
  { id: "p6", title: { ko: "정보주체의 권리", en: "Your rights" }, body: [{ ko: "언제든지 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며, 회사는 지체 없이 조치합니다. 마이페이지 또는 개인정보 보호책임자에게 요청하세요.", en: "You can ask to view, correct, delete or stop processing your data at any time, and we'll act without delay. Use My Page or contact our privacy officer." }] },
  { id: "p7", title: { ko: "안전성 확보 조치", en: "Security" }, body: [{ ko: "비밀번호 일방향 암호화, 계좌·카드번호 마스킹 저장, 접근 권한 관리, 접속 기록 보관 등의 조치를 하고 있습니다.", en: "We hash passwords one-way, store account and card numbers masked, control access and keep access logs." }] },
  { id: "p8", title: { ko: "개인정보 보호책임자", en: "Privacy officer" }, body: [{ ko: "개인정보 보호책임자: 경영지원팀장 · 전화 054-280-5114 · 이메일 privacy@yes-pohang.example", en: "Privacy officer: Head of Management Support · 054-280-5114 · privacy@yes-pohang.example" }] },
];

export function Privacy() {
  const t = useT();
  return (
    <LegalDoc
      effective="2026-07-01"
      sections={PRIVACY}
      note={
        <InfoBox tone="orange">
          <p className="font-bold">{t("리디자인 시안 안내", "About this redesign draft")}</p>
          <p className="mt-1">
            {t(
              "이 시안 사이트는 입력한 정보를 서버로 보내지 않습니다. 신청·납부·회원 정보는 지금 쓰는 기기의 브라우저(localStorage)에만 저장되며, 비밀번호는 SHA-256으로 변환해 저장하고 계좌·카드번호는 뒤 4자리만 남깁니다. 브라우저 데이터를 지우면 모두 삭제됩니다.",
              "This draft site never sends what you enter to a server. Requests, payments and account details are stored only in this browser (localStorage); passwords are stored as SHA-256 hashes and only the last 4 digits of account or card numbers are kept. Clearing browser data removes everything.",
            )}
          </p>
        </InfoBox>
      }
    />
  );
}

/* ═══ 웹 접근성 안내 ═════════════════════════════════════════════ */

const A11Y: Section[] = [
  { id: "a1", title: { ko: "준수 기준", en: "Standard" }, body: [{ ko: "이 사이트는 한국형 웹 콘텐츠 접근성 지침(KWCAG) 2.2와 WCAG 2.1 AA 수준을 목표로 설계했습니다.", en: "This site is designed to meet KWCAG 2.2 and WCAG 2.1 level AA." }] },
  { id: "a2", title: { ko: "주요 접근성 기능", en: "Accessibility features" }, body: [{ list: [
    { ko: "글자 크기 3단계 조절 (상단 '가 가 가' 버튼, 설정은 기억됩니다)", en: "Three text sizes (the “A A A” buttons at the top; your choice is remembered)" },
    { ko: "한국어·영어 전환 (상단 한국어 / ENG)", en: "Korean / English switch (top bar)" },
    { ko: "'본문 바로가기' 링크와 일관된 페이지 구조(머리말·본문·꼬리말)", en: "A 'skip to content' link and consistent landmarks (header, main, footer)" },
    { ko: "모든 기능을 키보드만으로 이용 가능, 눈에 잘 띄는 초점 표시", en: "Everything works by keyboard, with a clearly visible focus ring" },
    { ko: "입력 오류를 글자로 안내하고 해당 칸으로 바로 이동", en: "Form errors are described in text and focus moves to the field" },
    { ko: "터치 영역 최소 44px, 본문 대비 4.5:1 이상", en: "Touch targets of at least 44px and text contrast of at least 4.5:1" },
  ] }] },
  { id: "a3", title: { ko: "키보드로 이용하기", en: "Using a keyboard" }, body: [{ list: [
    { ko: "Tab / Shift+Tab: 다음·이전 항목으로 이동", en: "Tab / Shift+Tab: next / previous item" },
    { ko: "Enter / Space: 버튼·링크 실행, 선택", en: "Enter / Space: activate or select" },
    { ko: "Esc: 메뉴·결제창 닫기", en: "Esc: close menus and the payment window" },
    { ko: "← →: 상황별 안내 탭 이동", en: "← →: move between situation-guide tabs" },
  ] }] },
  { id: "a4", title: { ko: "알려진 제한 사항", en: "Known limitations" }, body: [{ ko: "청구서·증명서 인쇄물의 표 일부는 화면낭독기에서 표 머리글이 한 번만 읽힐 수 있습니다. 다음 개편에서 개선할 예정입니다.", en: "In printed bills and certificates, some screen readers announce table headers only once. We'll fix this in the next release." }] },
  { id: "a5", title: { ko: "개선 요청", en: "Report a barrier" }, body: [{ ko: "이용 중 불편한 점은 온라인 상담 또는 고객센터 1800-0098로 알려 주세요. 7일 안에 답변드립니다.", en: "Tell us about any barrier via online Q&A or 1800-0098 — we'll reply within 7 days." }] },
];

export function Accessibility() {
  const t = useT();
  return (
    <div className="space-y-4">
      <LegalDoc effective="2026-07-01" sections={A11Y} />
      <p className="text-center text-[0.875rem]">
        <Link href="/support/qna" className="font-bold text-sk-red-600 underline underline-offset-2">{t("접근성 개선 요청하기", "Report an accessibility issue")}</Link>
      </p>
    </div>
  );
}
