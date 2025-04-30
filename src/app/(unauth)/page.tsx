import { useTranslations } from "next-intl";
import Navbar03Page from "@/components/shadcnui-blocks/navbar-03/navbar-03";
import Hero01 from "@/components/shadcnui-blocks/hero-01";
import Footer05Page from "@/components/shadcnui-blocks/footer-05";
import Features01Page from "@/components/shadcnui-blocks/features-01";
import Timeline from "@/components/shadcnui-blocks/timeline-03";
import Testimonial05 from "@/components/shadcnui-blocks/testimonial-05";
import FAQ03 from "@/components/shadcnui-blocks/faq-03";
import Logos02Page from "@/components/shadcnui-blocks/logos-02/logos-02";
import Contact01Page from "@/components/shadcnui-blocks/contact-01/contact-01";
import Stats01Page from "@/components/shadcnui-blocks/stats-01/stats-01";

export default function Home() {
  return (
    <>
      <Navbar03Page />
      <Hero01 />
      <Features01Page />
      <Timeline />
      <Testimonial05 />
      <FAQ03 />
      <Logos02Page />
      <Contact01Page />
      <Stats01Page />
      <Footer05Page />
    </>
  );
}
