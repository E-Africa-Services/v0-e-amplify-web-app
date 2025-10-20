import { Card } from "@/components/ui/card"
import { Video, MessageSquare, TrendingUp, Shield, Zap, Heart } from "lucide-react"

const features = [
  {
    icon: Video,
    title: "Instant Video Sessions",
    description:
      "Connect face-to-face with mentors and learners through seamless video calls with built-in whiteboard and screen sharing.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Purpose Feed",
    description:
      "Share your growth journey, insights, and reflections. Build a community that celebrates learning and progress.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: TrendingUp,
    title: "Track Your Growth",
    description:
      "Visualize your learning journey with beautiful dashboards showing skills gained, sessions completed, and impact created.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Earn with Impact",
    description:
      "Monetize your expertise fairly. Set your rates, track earnings, and withdraw easily through secure payment systems.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description:
      "Our intelligent system connects you with the right mentors or learners based on skills, goals, and availability.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Heart,
    title: "Human-Centered",
    description:
      "Every feature is designed to foster genuine connections and meaningful growth, not just transactions.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Everything you need to <span className="text-primary">amplify</span> your growth
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            A complete platform designed for meaningful mentorship, authentic learning, and purposeful earning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
