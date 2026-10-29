import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";
import { T } from "@/lib/i18n";

export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return (
    <>
      <PageHero
        title={<T ko="로그인" en="Log in" />}
        lead={<T ko="아이디와 비밀번호로 로그인하세요." en="Sign in with your ID and password." />}
        crumbs={[{ label: <T ko="로그인" en="Log in" /> }]}
      />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
