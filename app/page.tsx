import { LandingHeader } from "@/features/landing/components/landing-header"
import { HeroSection } from "@/features/landing/components/hero-section"
import { SocialProofSection } from "@/features/landing/components/social-proof-section"
import { DashboardPipelineVisualizer } from "@/features/landing/components/dashboard-pipeline-visualizer"
import { RecruitmentTimelineSection } from "@/features/landing/components/recruitment-timeline-section"
import { AIScreeningVisualizer } from "@/features/landing/components/ai-screening-visualizer"
import { LiveInterviewVisualizer } from "@/features/landing/components/live-interview-visualizer"
import { CustomFormsVisualizer } from "@/features/landing/components/custom-forms-visualizer"
import { CandidateHubVisualizer } from "@/features/landing/components/candidate-hub-visualizer"
import { SolutionsSection } from "@/features/landing/components/solutions-section"
import { PricingSection } from "@/features/landing/components/pricing-section"
import { CTAFooterSection } from "@/features/landing/components/cta-footer-section"
import { ScrollProgressBar } from "@/features/landing/components/landing-motion"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <ScrollProgressBar />
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <SocialProofSection />
        <RecruitmentTimelineSection />
        <DashboardPipelineVisualizer />
        <AIScreeningVisualizer />
        <LiveInterviewVisualizer />
        <CustomFormsVisualizer />
        <CandidateHubVisualizer />
        <SolutionsSection />
        <PricingSection />
      </main>
      <CTAFooterSection />
    </div>
  )
}
