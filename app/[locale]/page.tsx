"use client";
import { AboutUs } from "@/components/AboutUs/AboutUs";
import { CallToAction } from "@/components/CallToAction/CallToAction";
import { Hero } from "@/components/Hero/Hero";
import { LegalStatus } from "@/components/LegalStatus/LegalStatus";
import { MarketplaceSection } from "@/components/Marketplace/Marketplace";
import { NewsSection } from "@/components/News/News";
import { ProvidersSection } from "@/components/Providers/Providers";
import { TestimonialsSection } from "@/components/Testimonials/Testimonials";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <>
      <Hero />
      <AboutUs />
      <LegalStatus />
      <NewsSection />
      <ProvidersSection />
      <MarketplaceSection />
      <TestimonialsSection />
      <CallToAction />
    </>
  );
}
