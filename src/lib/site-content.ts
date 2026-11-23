/**
 * Copy for the multi-page site: services, industries, blog categories and the
 * About story. Keep claims to what the company can stand behind. Do not add
 * client names, testimonials, dates or achievements here without verification.
 */

import type { ArtKind } from "@/components/art/Artwork";

export interface ContentBlock {
  id: string;
  /** Original artwork shown beside the text. */
  art: ArtKind;
  /** Saved illustration file in public/images. When set, it is shown instead of the inline artwork. */
  image?: string;
  title: string;
  summary: string;
  points: string[];
}

export const SERVICES: ContentBlock[] = [
  {
    id: "web-applications",
    art: "code",
    image: "/brand/01-web-application-development.png",
    title: "Web Application Development",
    summary:
      "Browser-based products for businesses and teams: dashboards, portals, booking and workflow tools, built to be fast, secure and easy to maintain.",
    points: [
      "Responsive interfaces that work on any device",
      "Secure sign-in, roles and data handling",
      "APIs and integrations with your existing systems",
      "Testing and deployment support",
    ],
  },
  {
    id: "mobile-applications",
    art: "device",
    image: "/brand/02-mobile-application-development.png",
    title: "Mobile Application Development",
    summary:
      "Android and iOS apps designed from the first tap: discovery and prototypes first, then build, store release and updates.",
    points: [
      "Android, iOS or cross-platform builds",
      "Clickable prototypes to test before development",
      "Store submission and release support",
      "Updates and improvements after launch",
    ],
  },
  {
    id: "custom-software",
    art: "building",
    image: "/brand/03-custom-software-development.png",
    title: "Custom Software Development",
    summary:
      "Software built around how your business works, replacing spreadsheets and manual steps with tools your team will actually use.",
    points: [
      "Requirements study and a clear scope",
      "Internal tools, admin panels and automation",
      "Backend services and databases",
      "Documentation and handover",
    ],
  },
  {
    id: "ai-solutions",
    art: "network",
    image: "/brand/04-ai-powered-solutions.png",
    title: "AI-Powered Solutions",
    summary:
      "Practical AI features that save time: screening, matching, voice and language tools, added where they make a measurable difference.",
    points: [
      "Candidate and lead screening",
      "Voice and language features",
      "Recommendation and matching",
      "People stay in the loop for decisions that matter",
    ],
  },
  {
    id: "ui-ux-design",
    art: "design",
    image: "/brand/05-ui-ux-design.png",
    title: "UI/UX Design",
    summary:
      "Interfaces that are easy to understand and pleasant to use, designed with real users in mind and tested before development starts.",
    points: [
      "User research and journey mapping",
      "Wireframes and clickable prototypes",
      "Design systems for consistent products",
      "Usability review of working builds",
    ],
  },
  {
    id: "digital-product-development",
    art: "bars",
    image: "/brand/06-digital-product-development.png",
    title: "Digital Product Development",
    summary:
      "From idea to working product: scope, design, build, launch and improvement, with one team across the whole journey.",
    points: [
      "Idea validation and scope",
      "MVP planning and build",
      "Launch and analytics setup",
      "Ongoing improvements",
    ],
  },
  {
    id: "website-development",
    art: "code",
    image: "/images/services/website-development.webp",
    title: "Website Development",
    summary:
      "Business websites that explain what you do clearly, load quickly on any device and make it easy for visitors to get in touch.",
    points: [
      "Company and corporate websites",
      "Mobile-friendly, fast-loading pages",
      "Contact forms and enquiry tools",
      "Pages you can update without a developer",
    ],
  },
  {
    id: "digital-marketing",
    art: "network",
    title: "Digital Marketing",
    summary:
      "Helping businesses get found and chosen online, with search, social and campaign work planned around clear goals.",
    points: [
      "Search engine optimisation (SEO)",
      "Social media and campaign planning",
      "Performance tracking and reporting",
      "Landing page and website improvements",
    ],
  },
];

export const INDUSTRIES: ContentBlock[] = [
  {
    id: "recruitment-staffing",
    art: "people",
    title: "Recruitment and Staffing",
    summary:
      "Tools for staffing agencies and in-house hiring teams: candidate screening, shortlisting, interview workflows and recruiter dashboards.",
    points: [
      "Candidate screening and shortlisting",
      "Voice-based candidate profiles",
      "Recruiter and employer dashboards",
      "Hiring pipeline reporting",
    ],
  },
  {
    id: "hr-workforce",
    art: "network",
    title: "Human Resources and Workforce Management",
    summary:
      "Systems that help HR teams manage hiring, onboarding, attendance, payroll and skills across a growing workforce.",
    points: [
      "Onboarding and document workflows",
      "Payroll and attendance support",
      "Skills and certification tracking",
      "Employee self-service portals",
    ],
  },
  {
    id: "education-skills",
    art: "campus",
    title: "Education and Skill Development",
    summary:
      "Learning and assessment tools for training institutes, skill programmes and placement cells.",
    points: [
      "Course and assessment apps",
      "Learner progress dashboards",
      "Placement tracking",
      "Mobile-first access for learners",
    ],
  },
  {
    id: "business-enterprise",
    art: "building",
    title: "Business and Enterprise Solutions",
    summary:
      "Software for operations-heavy businesses: internal tools, approvals, reporting and integrations with the systems already in use.",
    points: [
      "Internal tools and admin panels",
      "Approval and workflow automation",
      "Reporting dashboards",
      "Integrations with existing systems",
    ],
  },
];

export interface BlogCategory {
  id: string;
  art: ArtKind;
  title: string;
  summary: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "recruitment-technology",
    art: "people",
    title: "Recruitment Technology",
    summary: "How software is changing sourcing, screening and hiring.",
  },
  {
    id: "artificial-intelligence",
    art: "network",
    title: "Artificial Intelligence",
    summary: "Practical AI for hiring, operations and product teams.",
  },
  {
    id: "hiring-hr-trends",
    art: "bars",
    title: "Hiring and HR Trends",
    summary: "Workforce and hiring trends that affect employers and job seekers.",
  },
  {
    id: "software-development",
    art: "code",
    title: "Software Development",
    summary: "How we plan, build and ship web and mobile products.",
  },
  {
    id: "business-technology",
    art: "device",
    title: "Business Technology",
    summary: "Technology decisions for growing businesses.",
  },
];

export const VISION_MISSION = {
  vision: "Make hiring and building software simpler for businesses, and for the people they hire.",
  mission:
    "Deliver dependable staffing and software services, and build products that solve real hiring problems, with people kept at the centre.",
};

export const TECH_APPROACH = [
  {
    title: "Start with the problem",
    body: "We confirm who the product is for and what they need to do before any design or code.",
  },
  {
    title: "Build in short cycles",
    body: "You see working builds early and often, so decisions are made on real software, not on documents.",
  },
  {
    title: "Use AI where it saves time",
    body: "AI features are added for clear jobs such as screening and matching, with people reviewing the results.",
  },
  {
    title: "Plan for maintenance",
    body: "Security, testing and documentation are part of the build, so the product stays reliable after launch.",
  },
];
