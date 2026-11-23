import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { ContactForms } from "@/components/sections/ContactForms";
import { PageHero } from "@/components/sections/PageHero";
import { CONTACT_FORM_IDS, CONTACT_SIDE } from "@/lib/forms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact us | Sri Shivam Infotech",
  description:
    "Send a business services enquiry or a HireVaani question to Sri Shivam Infotech. Hyderabad office, Telangana.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Start a conversation"
        lede="Choose business services or HireVaani below. Both reach our team, and we will come back to you."
        art="building"
      />
      <ContactForms tabIds={CONTACT_FORM_IDS} side={CONTACT_SIDE} sectionId="enquiry" />
      <Contact />
    </>
  );
}
