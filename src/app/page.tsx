import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import NewsBoard from "@/components/NewsBoard";
import NoticeTicker from "@/components/NoticeTicker";

/**
 * Home. The hero and news board bracket the page in both states; the middle
 * personalizes. Signed in, the hero leads with the account + this-month bill
 * card and the usage chart comes right after, so the numbers a customer logs
 * in to check are the first thing they see. Signed out, the hero leads with
 * search + a safety SOS card, followed by quick services and a sign-in panel.
 */
export default function Home() {
  return (
    <>
      <NoticeTicker />
      <Hero />
      <HomeSections />
      <NewsBoard />
    </>
  );
}
