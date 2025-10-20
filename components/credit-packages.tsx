"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

const packages = [
  {
    credits: 50,
    price: 49,
    bonus: 0,
    popular: false,
  },
  {
    credits: 100,
    price: 89,
    bonus: 10,
    popular: true,
  },
  {
    credits: 250,
    price: 199,
    bonus: 50,
    popular: false,
  },
  {
    credits: 500,
    price: 349,
    bonus: 150,
    popular: false,
  },
]

export function CreditPackages() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Purchase Credits</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border-2 transition-all hover:shadow-md ${
              pkg.popular ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {pkg.popular && (
              <div className="flex items-center gap-1 text-primary text-sm font-medium mb-3">
                <Sparkles className="w-4 h-4" />
                Best Value
              </div>
            )}

            <div className="mb-4">
              <div className="text-4xl font-bold mb-1">{pkg.credits + pkg.bonus}</div>
              <div className="text-sm text-muted-foreground">
                {pkg.credits} credits {pkg.bonus > 0 && `+ ${pkg.bonus} bonus`}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold">${pkg.price}</div>
              <div className="text-xs text-muted-foreground">
                ${(pkg.price / (pkg.credits + pkg.bonus)).toFixed(2)} per credit
              </div>
            </div>

            <Button className="w-full rounded-full" variant={pkg.popular ? "default" : "outline"}>
              Purchase
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-muted/50">
        <h3 className="font-semibold mb-2">How Credits Work</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use credits to book mentorship sessions</li>
          <li>• Earn credits by hosting sessions</li>
          <li>• Credits never expire</li>
          <li>• Convert earned credits to cash anytime</li>
        </ul>
      </div>
    </Card>
  )
}
