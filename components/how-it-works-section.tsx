import { Card } from "@/components/ui/card"
import { UserPlus, Search, Video, BarChart } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Purpose Card",
    description: "Tell us what you teach, what you need, and why you're here. Set up your profile in minutes.",
  },
  {
    icon: Search,
    step: "02",
    title: "Discover & Match",
    description: "Browse mentors or learners based on skills, industry, and availability. Find your perfect match.",
  },
  {
    icon: Video,
    step: "03",
    title: "Connect & Grow",
    description: "Jump into video sessions with built-in tools. Share knowledge, collaborate, and build relationships.",
  },
  {
    icon: BarChart,
    step: "04",
    title: "Track Impact",
    description: "Watch your growth timeline expand. See skills gained, earnings tracked, and impact visualized.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Your journey starts in <span className="text-primary">four simple steps</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            From signup to your first meaningful connection—we've made it beautifully simple.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-5xl font-bold text-muted/20">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
