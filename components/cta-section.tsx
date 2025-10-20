import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Ready to amplify what matters?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
              Join thousands of mentors and learners who are already creating meaningful impact. Your journey starts
              today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="rounded-full text-base group" asChild>
                <Link href="/onboarding">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-base bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/70 mt-6">
              No credit card required • Free to start • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
