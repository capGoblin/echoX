"use client";

import { Suspense } from "react";
import { Nav } from "@/components/home/nav";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Footer } from "@/components/home/footer";
import { BackgroundEffects } from "@/components/visuals/background-effects";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Suspense fallback={null}>
        <BackgroundEffects />
      </Suspense>
      <div className="relative z-10">
        <Nav />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  );
}
