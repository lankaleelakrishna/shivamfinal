import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FormTabProvider } from "@/components/providers/FormTabProvider";
import { CapabilitiesMarquee } from "@/components/sections/CapabilitiesMarquee";
import { Contact } from "@/components/sections/Contact";
import { ContactForms } from "@/components/sections/ContactForms";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export default function HomePage() {
  return (
    <FormTabProvider>
      <Header />
      <main id="top">
        <Hero />
        <CapabilitiesMarquee />
        <WhyChooseUs />
        <Services />
        <Process />
        <Industries />
        <ProductsShowcase />
        <ContactForms />
        <Contact />
      </main>
      <Footer />
    </FormTabProvider>
  );
}
