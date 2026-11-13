import type { IconName } from "@/components/icons/Icon";

export interface Service {
  icon: IconName;
  title: string;
  body: string;
}

export interface ServiceGroup {
  id: "staffing" | "apps";
  title: string;
  intro: string;
  services: Service[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "staffing",
    title: "Staffing and recruitment",
    intro: "For companies that need the right people, fast and with the paperwork in order.",
    services: [
      { icon: "code", title: "IT staffing", body: "Developers, testers, DevOps, data and support engineers, on payroll or on contract." },
      { icon: "briefcase", title: "Non-IT staffing", body: "Sales, operations, HR, finance, admin and customer support roles." },
      { icon: "search", title: "Permanent recruitment", body: "Sourcing, screening and shortlisting for roles you want to fill for the long term." },
      { icon: "clock", title: "Contract and temporary staffing", body: "Project-based teams that scale up and down without adding to your headcount." },
      { icon: "rupee", title: "Payroll services", body: "Salary processing, statutory compliance and payslips for staff placed through us." },
      { icon: "truck", title: "Bulk and field hiring", body: "High-volume hiring for delivery, retail, warehouse and plant roles." },
    ],
  },
  {
    id: "apps",
    title: "Mobile app development",
    intro: "For founders and businesses that want an app in the Play Store and App Store, not a slide deck.",
    services: [
      { icon: "phone", title: "Android and iOS apps", body: "Native and cross-platform builds, tested on real devices." },
      { icon: "monitor", title: "Web apps and admin panels", body: "The dashboards your team uses to run what the app does." },
      { icon: "server", title: "Backend and APIs", body: "Databases, payments, notifications and integrations that hold up under load." },
      { icon: "spark", title: "AI and voice features", body: "Voice interviews, chat assistants, resume and job matching, multilingual input." },
      { icon: "pen", title: "UI/UX design", body: "Clickable prototypes you can test with users before development starts." },
      { icon: "rocket", title: "Launch and support", body: "Store listings, release management, bug fixes and updates after go-live." },
    ],
  },
];
