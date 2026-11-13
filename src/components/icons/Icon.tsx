import type { ReactNode, SVGProps } from "react";

/**
 * The reference site's own line-icon set (24×24, 1.8 stroke), ported from its
 * inline <symbol> sprite so every icon matches the original exactly.
 */
const PATHS = {
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="17.5" cy="9" r="2.4" />
      <path d="M17 14c2.4.2 4 1.9 4 4.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  rupee: <path d="M7 5h11M7 9.5h11M10 5c4 0 6 1.5 6 4.5S14 14 9 14l7 6" />,
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z" />
      <path d="M14 7l3 3" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3.5 2 5 5.5 4.5 10h-9C7 8.5 8.5 5 12 3z" />
      <circle cx="12" cy="9.5" r="1.6" />
      <path d="M7.5 13L5 17l3.5-.5M16.5 13L19 17l-3.5-.5M10 17l2 4 2-4" />
    </>
  ),
  building: <path d="M5 21V5l9-2v18M14 8h5v13M3 21h18M9 8h1M9 12h1M9 16h1" />,
  bank: <path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  cart: (
    <>
      <path d="M3 4h3l2.5 11h9.5L20 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V9l6 4V9l6 4V4h4v17z" />
      <path d="M7 17h2M12 17h2" />
    </>
  ),
  package: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  book: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  left: <path d="M19 12H5M11 6l-6 6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  link: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  file: (
    <>
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
}

export function Icon({ name, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ? `ic ${className}` : "ic"}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
