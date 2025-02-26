import CTA from "@/components/landing/cta";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        {/* <Testimonials /> */}
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
