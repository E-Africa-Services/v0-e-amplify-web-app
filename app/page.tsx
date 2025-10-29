import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { HomeAuthRedirect } from "@/components/home-auth-redirect"
import type { Metadata } from "next"

/**
 * Home page - Server Component for optimal SEO and performance.
 * All marketing content is server-rendered.
 * Auth redirect logic is handled by the HomeAuthRedirect client component.
 */

// SEO metadata - only possible with server components
export const metadata: Metadata = {
  title: "E-Amplify - Connect, Learn, and Grow Together",
  description: "Join E-Amplify, the platform where learners and mentors connect to share knowledge, build skills, and grow together. Find your mentor or become one today.",
  keywords: ["mentorship", "learning", "education", "skills", "professional development", "coaching"],
  openGraph: {
    title: "E-Amplify - Connect, Learn, and Grow Together",
    description: "Join E-Amplify, the platform where learners and mentors connect to share knowledge, build skills, and grow together.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Amplify - Connect, Learn, and Grow Together",
    description: "Join E-Amplify, the platform where learners and mentors connect to share knowledge, build skills, and grow together.",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Client component handles auth-based redirects without blocking SSR */}
      <HomeAuthRedirect />
      
      {/* All marketing content is server-rendered for SEO */}
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
