import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";
import { T } from "@/lib/i18n";

export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return (
    <>
      <PageHero
        title={<T ko="로그인" en="Log in" />}
        lead={<T ko="간편인증이나 공동인증서로 로그인하세요." en="Sign in with simple or certificate-based authentication." />}
        crumbs={[{ label: <T ko="로그인" en="Log in" /> }]}
      />
      <LoginForm />
    </>
  );
}
