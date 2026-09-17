import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/* ── SK Happy-Wings mark (stylised, brand-coloured) ───────────── */
export function SkWings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 30"
      className={className}
      role="img"
      aria-label="SK"
    >
      {/* Left wing — SK Red */}
      <path
        d="M28 28C25.8 17.4 18.2 8.2 4.6 2.2c-1.5-.7-2.9.9-2 2.3C10 16 18 24 28 28Z"
        fill="#EA002C"
      />
      {/* Right wing — SK Orange */}
      <path
        d="M28 28c2.2-10.6 9.8-19.8 23.4-25.8 1.5-.7 2.9.9 2 2.3C46 16 38 24 28 28Z"
        fill="#FF7A00"
      />
    </svg>
  );
}

/* ── Service icons ────────────────────────────────────────────── */
export const IconMoveIn = (p: P) => (
  <svg {...base} {...p}><path d="M14 20.4h4.6a1.4 1.4 0 0 0 1.4-1.4v-8L13.2 4.3a1.4 1.4 0 0 0-1.9 0l-3.1 2.9" /><path d="M2.6 12.6h8.2" /><path d="m7.6 9.2 3.4 3.4-3.4 3.4" strokeWidth="2.1" /></svg>
);
export const IconMoveOut = (p: P) => (
  <svg {...base} {...p}><path d="M10 20.4H5.4A1.4 1.4 0 0 1 4 19v-8l6.8-6.7a1.4 1.4 0 0 1 1.9 0l3.1 2.9" /><path d="M21.4 12.6h-8.2" /><path d="m16.4 9.2 3.4 3.4-3.4 3.4" strokeWidth="2.1" /></svg>
);
export const IconBill = (p: P) => (
  <svg {...base} {...p}><path d="M5.4 2.8h13.2v18.4l-2.6-1.6-2.2 1.6-2.4-1.6-2.2 1.6-2.2-1.6-1.6 1.6Z" /><path d="m9.2 8.2 2.8 4.4 2.8-4.4" /><path d="M8.6 12.2h6.8M8.6 14.6h6.8" /></svg>
);
export const IconAutoPay = (p: P) => (
  <svg {...base} {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.6" /><path d="M2.5 9.6h19" /><path d="M7.4 15.6c1.3 1.1 3.3.9 4.3-.5" /><path d="M11.2 12.6 12 15l-2.4.4" /></svg>
);
export const IconCalculator = (p: P) => (
  <svg {...base} {...p}><rect x="4" y="2.6" width="16" height="18.8" rx="2.6" /><rect x="7.2" y="5.8" width="9.6" height="3.6" rx="1" /><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" strokeWidth="2.4" /></svg>
);
export const IconMeter = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="4.2" width="18" height="15.6" rx="2.6" /><rect x="6" y="7.2" width="12" height="4" rx="1" /><path d="M8.6 9.2h.01M11 9.2h.01M13.4 9.2h.01M15.8 9.2h.01" strokeWidth="2.2" /><circle cx="12" cy="15.6" r="2.8" /><path d="m12 15.6 1.9-1.6" strokeWidth="1.9" /></svg>
);
export const IconStove = (p: P) => (
  <svg {...base} {...p}><rect x="2.8" y="5.6" width="18.4" height="12.8" rx="2.4" /><circle cx="8" cy="10.4" r="2.5" /><circle cx="16" cy="10.4" r="2.5" /><circle cx="8" cy="10.4" r=".7" fill="currentColor" stroke="none" /><circle cx="16" cy="10.4" r=".7" fill="currentColor" stroke="none" /><path d="M6.6 15.4h.01M12 15.4h.01M17.4 15.4h.01" strokeWidth="2.4" /><path d="M7 18.4v1.8M17 18.4v1.8" /></svg>
);
export const IconCenter = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
);
export const IconFlame = (p: P) => (
  <svg {...base} {...p}><path d="M12 3s5.4 4.2 5.4 9.2A5.4 5.4 0 0 1 12 21a5.4 5.4 0 0 1-5.4-8.8C7.5 9 10 8.4 12 3Z" /><path d="M12 21a2.6 2.6 0 0 1-2.4-3.6c.6-1.4 2.4-2 2.4-4 0 0 2.8 2 2.8 4.2A2.6 2.6 0 0 1 12 21Z" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...base} {...p}><path d="M12 2.8 19.4 6v6c0 4.6-3.1 8-7.4 9.2C7.7 20 4.6 16.6 4.6 12V6Z" /><path d="m9 12 2.2 2.2L15.4 10" /></svg>
);
export const IconDoc = (p: P) => (
  <svg {...base} {...p}><path d="M13.6 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2Z" /><path d="M13.6 2.8v5.4H19" /><path d="M8.6 13h6.8M8.6 16.6h4.4" /></svg>
);
export const IconChat = (p: P) => (
  <svg {...base} {...p}><path d="M20.4 12.6c0 4-3.8 7.2-8.4 7.2a9.9 9.9 0 0 1-2.6-.34L4.6 21l1.1-3.6A6.9 6.9 0 0 1 3.6 12.6c0-4 3.8-7.2 8.4-7.2s8.4 3.2 8.4 7.2Z" /></svg>
);
export const IconPhone = (p: P) => (
  <svg {...base} {...p}><path d="M6.2 3.6h3l1.5 3.8-2 1.4a12 12 0 0 0 5.5 5.5l1.4-2 3.8 1.5v3a1.8 1.8 0 0 1-2 1.8A15.6 15.6 0 0 1 4.4 5.6a1.8 1.8 0 0 1 1.8-2Z" /></svg>
);
export const IconSearch = (p: P) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m16.2 16.2 4.3 4.3" /></svg>
);
export const IconUser = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="3.8" /><path d="M4.8 20.2a7.6 7.6 0 0 1 14.4 0" /></svg>
);
export const IconMenu = (p: P) => (
  <svg {...base} {...p}><path d="M3.6 6.8h16.8M3.6 12h16.8M3.6 17.2h16.8" strokeWidth="2" /></svg>
);
export const IconClose = (p: P) => (
  <svg {...base} {...p}><path d="M6 6 18 18M18 6 6 18" strokeWidth="2" /></svg>
);
export const IconChevron = (p: P) => (
  <svg {...base} {...p}><path d="m9 5.5 6.6 6.5L9 18.5" strokeWidth="2" /></svg>
);
export const IconArrowRight = (p: P) => (
  <svg {...base} {...p}><path d="M4.5 12h15" /><path d="m13.6 6 6 6-6 6" /></svg>
);
export const IconHome = (p: P) => (
  <svg {...base} {...p}><path d="M3.4 11 12 3.8 20.6 11" /><path d="M5.8 9.6V20h12.4V9.6" /></svg>
);
export const IconPause = (p: P) => (
  <svg {...base} {...p}><path d="M9 5.5v13M15 5.5v13" strokeWidth="2.2" /></svg>
);
export const IconPlay = (p: P) => (
  <svg {...base} {...p}><path d="M7.5 5 18.5 12 7.5 19Z" fill="currentColor" /></svg>
);
export const IconAlert = (p: P) => (
  <svg {...base} {...p}><path d="M12 3.6 21.4 20H2.6Z" /><path d="M12 9.8v4.4M12 17.4h.01" strokeWidth="2.2" /></svg>
);
export const IconCell = (p: P) => (
  <svg {...base} {...p}><rect x="4" y="3" width="10" height="18" rx="2.4" /><path d="M8.4 17.6h1.2" /><path d="M16.8 8.4a5 5 0 0 1 0 7.2" /><path d="M19.4 6a8.4 8.4 0 0 1 0 12" /></svg>
);
export const IconLeaf = (p: P) => (
  <svg {...base} {...p}><path d="M20 4c0 9-5.2 14.4-12.4 13.4C5.4 17 4 15 4 12.6 4 7.4 10.6 4 20 4Z" /><path d="M4.6 20c2.4-4.6 6-8 10.8-10" /></svg>
);
export const IconSnow = (p: P) => (
  <svg {...base} {...p}><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" /><path d="m9.4 4.8 2.6 2.4 2.6-2.4M9.4 19.2l2.6-2.4 2.6 2.4" /></svg>
);
export const IconBattery = (p: P) => (
  <svg {...base} {...p}><rect x="2.6" y="7" width="16" height="10" rx="2.4" /><path d="M21.4 10.4v3.2" /><path d="m11.4 9.4-2.2 3.4h3l-2 2.8" /></svg>
);
export const IconTruck = (p: P) => (
  <svg {...base} {...p}><path d="M2.6 6.6h10.2v9.8H2.6Z" /><path d="M12.8 10h3.6l2.8 3v3.4h-6.4Z" /><circle cx="7" cy="18.4" r="1.9" /><circle cx="16.6" cy="18.4" r="1.9" /></svg>
);
export const IconTextSize = (p: P) => (
  <svg {...base} {...p}><path d="M3.4 18 8 6.4 12.6 18" /><path d="M5.2 14.2h5.6" /><path d="M14.4 18 17.6 9.8 20.8 18" /><path d="M15.6 15.3h4" /></svg>
);
