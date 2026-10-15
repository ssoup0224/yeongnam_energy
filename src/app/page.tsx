import BentoHome from "@/components/BentoHome";

/**
 * Home — a bento board of tiles rather than stacked sections. The tiles stay
 * the same shape in both states; signing in personalizes them: the search
 * anchor becomes the account + this-month bill, and the safety card becomes
 * the 6-month usage chart.
 */
export default function Home() {
  return <BentoHome />;
}
