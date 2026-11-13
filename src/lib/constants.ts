import type { IconName } from "@/components/icons/Icon";

export const COMPANY = {
  shortName: "Sri Shivam Infotech",
  legalName: "Sri Shivam Infotech Solutions Pvt. Ltd.",
  monogram: "SS",
  tagline: "Staffing · Recruitment · Mobile apps",
  footerBlurb: "Staffing, recruitment, payroll and mobile app development from Hyderabad.",
  copyright: "© 2026 Sri Shivam Infotech Solutions Pvt. Ltd. Hyderabad, India.",
} as const;

export const ADDRESS = {
  lines: ["Sri Shivam Infotech Solutions Pvt. Ltd.", "3rd Floor, Geetanjali Building", "S.R. Nagar, Hyderabad"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Geetanjali+Building+S.R.+Nagar+Hyderabad",
} as const;

export interface NavLink {
  href: `#${string}`;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How we work" },
  { href: "#industries", label: "Industries" },
  { href: "#work", label: "Our products" },
  { href: "#contact", label: "Contact" },
];

export const FOOTER_EXPLORE: NavLink[] = NAV_LINKS.filter((l) => l.href !== "#contact");

export const FOOTER_CONTACT: NavLink[] = [
  { href: "#hire", label: "Hire talent" },
  { href: "#hire", label: "Get an app quote" },
  { href: "#hire", label: "Looking for a job" },
  { href: "#contact", label: "Office address" },
];

export const HERO = {
  eyebrow: "Hyderabad · Sri Shivam Infotech Solutions Pvt. Ltd.",
  lede: "One Hyderabad company for hiring and building. We recruit IT and non-IT talent, run payroll, and develop mobile apps for businesses that need both.",
  points: ["IT and non-IT hiring", "Payroll", "Android and iOS apps"],
  /** Shown when WebGL is unavailable (same as the reference fallback). */
  desks: [
    {
      title: "Talent desk",
      items: ["IT staffing", "Non-IT staffing", "Permanent hiring", "Contract staffing", "Payroll", "Bulk hiring"],
    },
    {
      title: "Product desk",
      items: ["Android apps", "iOS apps", "Cross-platform", "Backend and APIs", "AI and voice", "UI/UX design"],
    },
  ],
} as const;

export const MARQUEE_ITEMS = [
  "IT Staffing",
  "Non-IT Recruitment",
  "Payroll Solutions",
  "Mobile App Development",
  "AI & Voice Technology",
  "Product Engineering",
] as const;

export interface Feature {
  icon: IconName;
  title: string;
  body: string;
}

export const WHY_US: Feature[] = [
  {
    icon: "users",
    title: "Hiring and software, one team",
    body: "Tell us once. The people who recruit your team sit next to the people who build your app.",
  },
  {
    icon: "phone",
    title: "We run our own products",
    body: "Five apps built in-house, some live on Google Play. We know what it takes to launch, not only to quote.",
  },
  {
    icon: "spark",
    title: "AI-assisted screening",
    body: "We built our own AI calling system for candidate screening, so shortlists reach you faster.",
  },
];

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ProcessFlow {
  title: string;
  steps: ProcessStep[];
}

export const PROCESS: ProcessFlow[] = [
  {
    title: "A hiring request",
    steps: [
      { title: "Brief", body: "We confirm the role, skills, budget, location and joining time." },
      { title: "Source", body: "Our recruiters search the database, job portals and referrals." },
      { title: "Screen", body: "Phone and video screening for skills, notice period and expectations." },
      { title: "Shortlist", body: "You receive profiles that match the brief and schedule interviews." },
      { title: "Join", body: "Offer, documentation, onboarding and payroll set-up." },
    ],
  },
  {
    title: "An app project",
    steps: [
      { title: "Discover", body: "We write down the users, the core features and what to leave for later." },
      { title: "Design", body: "Screens and a clickable prototype you approve before any code." },
      { title: "Build", body: "Short cycles with working builds you can install and try." },
      { title: "Launch", body: "Testing, store submission and release." },
      { title: "Support", body: "Fixes, updates and new features as your users grow." },
    ],
  },
];

export interface Industry {
  icon: IconName;
  label: string;
}

export const INDUSTRIES: Industry[] = [
  { icon: "code", label: "IT and software" },
  { icon: "building", label: "Global capability centres" },
  { icon: "bank", label: "Banking and finance" },
  { icon: "pulse", label: "Healthcare" },
  { icon: "cart", label: "Retail and e-commerce" },
  { icon: "factory", label: "Manufacturing" },
  { icon: "package", label: "Logistics and delivery" },
  { icon: "book", label: "Education" },
  { icon: "home", label: "Real estate" },
  { icon: "bolt", label: "Startups" },
];

export const CONTACT_ROWS: Array<[label: string, value: string]> = [
  ["Staffing and recruitment", "IT and non-IT"],
  ["Payroll", "Placed staff"],
  ["Mobile app development", "Android, iOS"],
  ["Based in", "Hyderabad, India"],
];
