import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// High Priority Components
import HeroSection from "@/components/sp-landing/HeroSection";

const InstitutesMarketplaceSection = dynamic(
  () => import("@/components/sp-landing/InstitutesMarketplaceSection")
);
const EdupreneurSection = dynamic(
  () => import("@/components/sp-landing/EdupreneurSection")
);

// Very heavy components - delayed loading strategy
const LearningHubNetworkSection = dynamic(
  () => import("@/components/sp-landing/LearningHubNetworkSection")
);
const CareerBootcampsSection = dynamic(
  () => import("@/components/sp-landing/CareerBootcampsSection")
);
const K12TutoringSection = dynamic(
  () => import("@/components/sp-landing/K12TutoringSection")
);
const LearningDevicesSection = dynamic(
  () => import("@/components/sp-landing/LearningDevicesSection")
);
const ScholarPassPlusSection = dynamic(
  () => import("@/components/sp-landing/ScholarPassPlusSection")
);
const TransparencySection = dynamic(
  () => import("@/components/sp-landing/TransparencySection")
);
const FinalCTASection = dynamic(
  () => import("@/components/sp-landing/FinalCTASection")
);

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <HeroSection />

      <Suspense fallback={null}>
        <ScholarPassPlusSection />
        
        {/* Unfinished K12 Courses & Bundles removed per request */}
        
        <K12TutoringSection />
        <CareerBootcampsSection />
        <LearningDevicesSection />

        <LearningHubNetworkSection />

        <EdupreneurSection />
        <InstitutesMarketplaceSection />

        <TransparencySection />
        <FinalCTASection />
      </Suspense>
    </main>
  );
}
