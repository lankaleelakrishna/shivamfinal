export type ProductId = "hirenova" | "hirevaani" | "vivahlive" | "circle" | "parknow";

export type ProductStatusTone = "ok" | "blue" | "warn";

export interface Product {
  id: ProductId;
  name: string;
  /** Accent colour used for the picker dot, stage glow and the scene's key light. */
  color: number;
  status: { label: string; tone: ProductStatusTone };
  summary: string;
  features: [string, string, string];
  tech: string;
  link?: { href: string; label: string };
  /** Several store links for products that ship more than one app. Shown after `link`. */
  links?: { href: string; label: string }[];
  /** Base scale of the 3D model on the stage (from the reference). */
  modelScale: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "hirevaani",
    name: "HireVaani",
    color: 0xf5a04a,
    status: { label: "On Google Play", tone: "ok" },
    summary: "A voice-first hiring app for blue-collar workers. Workers speak instead of typing.",
    features: ["Voice-based profiles", "Short voice interviews", "Verified skill badges for employers"],
    tech: "Android · Voice AI",
    links: [
      { href: "https://play.google.com/store/apps/details?id=com.hirevaani.ai.worker&hl=en_IN", label: "Worker app on Google Play" },
      { href: "https://play.google.com/store/apps/details?id=com.hirevaani.ai.employer&hl=en_IN", label: "Employer app on Google Play" },
    ],
    modelScale: 0.95,
  },
  {
    id: "parknow",
    name: "ParkNow",
    color: 0x2bd67b,
    status: { label: "On Google Play", tone: "ok" },
    summary: "Find parking nearby and reserve a space before you arrive.",
    features: ["Nearby spots with rates and details", "Reserve a space for your vehicle", "Bookings and past trips in one place"],
    tech: "Android · Web admin dashboard",
    link: { href: "https://play.google.com/store/apps/details?id=com.parknow.mobile", label: "View on Google Play" },
    modelScale: 0.9,
  },
  {
    id: "hirenova",
    name: "HireNova AI",
    color: 0x5b8cff,
    status: { label: "Live", tone: "ok" },
    summary: "Rewrites a candidate's resume to fit the job they are applying for.",
    features: ["AI rewriting for each job description", "Plans starting at ₹99", "Pay online with Razorpay"],
    tech: "Web · AI resume rewriting",
    link: { href: "https://gethirenova.com", label: "Visit gethirenova.com" },
    modelScale: 1,
  },
  {
    id: "vivahlive",
    name: "VivahLive",
    color: 0xff5c8a,
    status: { label: "Demo built", tone: "blue" },
    summary: "Matrimony through live video, designed for Indian families and users.",
    features: ["Live video introductions", "Instant matching", "Coin-based model"],
    tech: "React Native · Live video streaming",
    modelScale: 1,
  },
  {
    id: "circle",
    name: "Circle",
    color: 0xa78bfa,
    status: { label: "Prototype", tone: "warn" },
    summary: "A private app for small friend groups, where nothing stays forever.",
    features: ["Private groups of 2 to 10", "Posts disappear after 24 hours", "Telugu, Hindi, Tamil, Kannada, English"],
    tech: "React · Multilingual voice input",
    modelScale: 1,
  },
];

export const PRODUCT_ORDER: ProductId[] = PRODUCTS.map((p) => p.id);

export const productById = (id: ProductId): Product => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

export const hexToCss = (hex: number): string => `#${hex.toString(16).padStart(6, "0")}`;

export const hexToRgba = (hex: number, alpha: number): string =>
  `rgba(${(hex >> 16) & 255},${(hex >> 8) & 255},${hex & 255},${alpha})`;

/** Seconds between automatic product changes, until the visitor interacts. */
export const AUTO_ADVANCE_MS = 7000;
