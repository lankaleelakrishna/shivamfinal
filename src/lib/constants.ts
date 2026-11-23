import type { IconName } from "@/components/icons/Icon";
import type { FormTabId } from "@/lib/forms";

export const COMPANY = {
  shortName: "Sri Shivam Infotech",
  legalName: "Sri Shivam Infotech Solutions Pvt. Ltd.",
  monogram: "SS",
  tagline: "Staffing · Recruitment · Mobile apps",
  footerBlurb: "Staffing, recruitment, payroll and mobile app development from Hyderabad.",
  copyright: "© 2026 Sri Shivam Infotech Solutions Pvt. Ltd. Hyderabad, India.",
} as const;

export const ADDRESS = {
  lines: [
    "Sri Shivam Infotech Solutions Pvt. Ltd.",
    "2nd Floor, Geetanjali, #44/A",
    "Opp. Police Station, Sanjeeva Reddy Nagar",
    "Hyderabad, Telangana 500038",
  ],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Sri Shivam Infotech Solutions, 2nd Floor, Geetanjali, #44/A, Opp. Police Station, Sanjeeva Reddy Nagar, Hyderabad, Telangana 500038"),
  phone: { tel: "+919014991928", display: "+91 90149 91928" },
} as const;

export interface NavLink {
  href: string;
  label: string;
  /** Contact enquiry type to select when the link is followed. */
  form?: FormTabId;
}

export interface NavItem extends NavLink {
  /** Optional dropdown links. The top-level link still goes to `href`. */
  children?: NavLink[];
}

/** Main navigation, in order. Gallery is intentionally not part of the site. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About Us",
    children: [
      { href: "/about#company", label: "Company introduction" },
      { href: "/about#vision", label: "Vision and mission" },
      { href: "/about#technology", label: "Our technology approach" },
      { href: "/about#hirevaani", label: "The HireVaani story" },
    ],
  },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services#web-applications", label: "Web Application Development" },
      { href: "/services#mobile-applications", label: "Mobile Application Development" },
      { href: "/services#custom-software", label: "Custom Software Development" },
      { href: "/services#ai-solutions", label: "AI-Powered Solutions" },
      { href: "/services#ui-ux-design", label: "UI/UX Design" },
      { href: "/services#digital-product-development", label: "Digital Product Development" },
    ],
  },
  {
    href: "/industries",
    label: "Industries",
    children: [
      { href: "/industries#recruitment-staffing", label: "Recruitment and Staffing" },
      { href: "/industries#hr-workforce", label: "Human Resources and Workforce" },
      { href: "/industries#education-skills", label: "Education and Skill Development" },
      { href: "/industries#business-enterprise", label: "Business and Enterprise" },
    ],
  },
  {
    href: "/clients",
    label: "Clients",
    children: [
      { href: "/clients#projects", label: "Project showcase" },
      { href: "/clients#partners", label: "Partnerships" },
      { href: "/portfolio", label: "Our products" },
    ],
  },
  {
    href: "/blogs",
    label: "Blogs",
    children: [
      { href: "/blogs#recruitment-technology", label: "Recruitment Technology" },
      { href: "/blogs#artificial-intelligence", label: "Artificial Intelligence" },
      { href: "/blogs#hiring-hr-trends", label: "Hiring and HR Trends" },
      { href: "/blogs#software-development", label: "Software Development" },
      { href: "/blogs#business-technology", label: "Business Technology" },
    ],
  },
  {
    href: "/contact",
    label: "Contact Us",
    children: [
      { href: "/contact#enquiry", label: "Business services enquiry", form: "business" },
      { href: "/contact#enquiry", label: "HireVaani enquiry", form: "hirevaani" },
    ],
  },
];

/** Footer explore column: the main pages, without Home. */
export const FOOTER_EXPLORE: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/clients", label: "Clients" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact Us" },
];

export interface FooterLink extends NavLink {
  /** Form tab to open on the home page, when the link is a hiring or quote CTA. */
  pick?: FormTabId;
}

export type SocialIcon = "facebook" | "instagram" | "linkedin";

export const FOOTER_SOCIAL: { href: string; label: string; icon: SocialIcon }[] = [
  { href: "https://www.facebook.com/share/1E3ZBwzPef/", label: "Facebook", icon: "facebook" },
  { href: "https://www.instagram.com/hirevaani", label: "Instagram", icon: "instagram" },
  { href: "https://www.linkedin.com/in/hirevaani-all-jobs-6a6b7944b/", label: "LinkedIn", icon: "linkedin" },
];

export const FOOTER_CONTACT: FooterLink[] = [
  { href: "/#hire", label: "Hire talent", pick: "hire" },
  { href: "/#hire", label: "Get an app quote", pick: "app" },
  { href: "/#hire", label: "Looking for a job", pick: "job" },
  { href: "/#contact", label: "Office address" },
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
