import { Navbar } from "@/components/navbar"
import { PricingCards } from "@/components/pricing-cards"
import { PricingFAQ } from "@/components/pricing-faq"
import { CTASection } from "@/components/cta-section"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-balance">
              Simple, transparent <span className="text-primary">pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Choose the plan that works for you. All plans include access to our community and core features.
            </p>
          </div>

          <PricingCards />
          <PricingFAQ />
        </div>
      </div>

      <CTASection />
    </div>
  )
}
