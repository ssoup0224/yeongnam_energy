import Link from "next/link";
import { T } from "@/lib/i18n";
import { IconArrowRight, IconHome } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-center py-20 text-center lg:py-28">
      <p className="text-[4rem] font-extrabold leading-none sk-gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink-900">
        <T ko="찾으시는 페이지가 없습니다" en="This page doesn't exist" />
      </h1>
      <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
        <T
          ko="주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 필요한 업무로 바로 이동해 보세요."
          en="The address may have changed or the page was removed. Jump to what you need below."
        />
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="inline-flex min-h-13 items-center gap-2 rounded-xl sk-gradient px-6 text-base font-extrabold text-white hover:brightness-95"
        >
          <IconHome className="size-5" /> <T ko="홈으로" en="Home" />
        </Link>
        <Link
          href="/sitemap"
          className="inline-flex min-h-13 items-center gap-2 rounded-xl border-2 border-ink-200 px-6 text-base font-bold text-ink-700 hover:border-ink-300"
        >
          <T ko="전체 메뉴" en="All services" /> <IconArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
