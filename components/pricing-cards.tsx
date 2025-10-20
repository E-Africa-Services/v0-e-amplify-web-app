"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "2 posts per day",
      "Browse mentors",
      "Join community discussions",
      "Basic profile",
      "Access to public sessions",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Creator",
    price: 29,
    description: "For active learners and mentors",
    features: [
      "Unlimited posts",
      "Priority mentor matching",
      "Advanced analytics",
      "Custom profile themes",
      "Host unlimited sessions",
      "Earn from mentorship",
      "50 credits included monthly",
    ],
    cta: "Start Creating",
    popular: true,
  },
  {
    name: "Pro",
    price: 79,
    description: "For professional mentors",
    features: [
      "Everything in Creator",
      "Featured profile placement",
      "Advanced scheduling tools",
      "Custom branding",
      "Priority support",
      "API access",
      "200 credits included monthly",
      "Revenue analytics",
    ],
    cta: "Go Pro",
    popular: false,
  },
]

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {plans.map((plan, i) => (
        <Card key={i} className={`p-8 relative ${plan.popular ? "border-primary border-2 shadow-lg scale-105" : ""}`}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          <Button className="w-full rounded-full mb-6" variant={plan.popular ? "default" : "outline"} asChild>
            <Link href="/onboarding">{plan.cta}</Link>
          </Button>

          <div className="space-y-3">
            {plan.features.map((feature, j) => (
              <div key={j} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
