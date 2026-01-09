"use client";
import { AboutUs } from "@/components/AboutUs/AboutUs";
import { CallToAction } from "@/components/CallToAction/CallToAction";
import { EventsSection } from "@/components/Events/Events";
import { Hero } from "@/components/Hero/Hero";
import { LegalStatus } from "@/components/LegalStatus/LegalStatus";
import { MarketplaceSection } from "@/components/Marketplace/Marketplace";
import { NewsSection } from "@/components/News/News";
import { ProvidersSection } from "@/components/Providers/Providers";
import { TestimonialsSection } from "@/components/Testimonials/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
      <LegalStatus />
      <NewsSection />
      <EventsSection />
      <ProvidersSection />
      <MarketplaceSection />
      <TestimonialsSection />
      <CallToAction />
    </>
  );
}
