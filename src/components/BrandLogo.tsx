/* Official SK innovation E&S CI, swapped by language with a pure-CSS
   show/hide (see globals.css .only-ko/.only-en). Stays a Server Component
   so it renders instantly with no hydration flash. */
export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/sk-ci-ko.svg"
        alt="SK이노베이션 E&S"
        className="only-ko h-full w-auto"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/sk-ci-en.svg"
        alt="SK innovation E&S"
        className="only-en h-full w-auto"
        draggable={false}
      />
    </span>
  );
}
