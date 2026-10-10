import type { CSSProperties } from "react";
export type IconName =
  | "home"
  | "grid"
  | "heart"
  | "spark"
  | "arrow"
  | "plus"
  | "phone"
  | "paper"
  | "check"
  | "leaf"
  | "message";
const paths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7v10H3z" />
      <path d="M9 20v-7h6v7" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  heart: (
    <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 5 2 10 8 15 6-5 12-10 8-15Z" />
  ),
  spark: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" />
      <path d="M21 2v4m-2-2h4" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M10 5h4M11 19h2" />
    </>
  ),
  paper: (
    <>
      <path d="M5 3h14v18H5zM8 7h8M8 11h4m-4 4h8m-8 3h8" />
      <path d="M14 10h2v3h-2z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  leaf: (
    <>
      <path d="M20 3C6 2 2 8 5 15c7 5 15-1 15-12Z" />
      <path d="M3 21 16 8" />
    </>
  ),
  message: <path d="M3 4h18v13H8l-5 4z" />,
};
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
