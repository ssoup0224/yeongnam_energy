import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import SearchView from "@/components/SearchView";
import { T } from "@/lib/i18n";

export const metadata: Metadata = { title: "통합 검색" };

export default function SearchPage() {
  return (
    <>
      <PageHero
        title={<T ko="통합 검색" en="Search" />}
        lead={
          <T
            ko="업무 이름, 공지 제목, 자주 묻는 질문을 한 번에 찾습니다."
            en="Search tasks, notice titles and FAQs all at once."
          />
        }
        crumbs={[{ label: <T ko="통합 검색" en="Search" /> }]}
      />
      <Suspense fallback={null}>
        <SearchView />
      </Suspense>
    </>
  );
}
