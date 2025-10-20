import { Button } from "@/components/ui/button"
import { ArrowRight, Video, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Join 10,000+ mentors and learners
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-balance">
              Find Purpose. <span className="text-primary">Share Knowledge.</span>{" "}
              <span className="text-secondary">Earn with Impact.</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              Connect instantly via video for mentorship and collaboration. Build meaningful relationships, grow your
              skills, and create impact—all in one beautiful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full text-base group" asChild>
                <Link href="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base bg-transparent" asChild>
                <Link href="/onboarding">Find a Mentor</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base bg-transparent" asChild>
                <Link href="/onboarding">Offer Mentorship</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Sessions Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8">
                <div className="h-full rounded-2xl bg-card p-6 flex flex-col justify-between shadow-lg">
                  {/* Mock video call interface */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20" />
                      <div>
                        <div className="h-3 w-24 bg-primary/30 rounded" />
                        <div className="h-2 w-16 bg-muted mt-2 rounded" />
                      </div>
                    </div>
                    <div className="h-40 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Video className="w-12 h-12 text-primary/40" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 rounded-full bg-primary/10" />
                      <div className="flex-1 h-10 rounded-full bg-secondary/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-lg p-4 border border-border animate-float">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Live Now</span>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-lg p-4 border border-border animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">+150% Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
