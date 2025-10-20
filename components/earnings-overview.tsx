import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function EarningsOverview() {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Earnings</h2>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-4xl font-bold mb-1">$2,350</div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+23% from last month</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">This Month</span>
            <span className="font-semibold">$850</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Available Credits</span>
            <span className="font-semibold">125</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="font-semibold">$150</span>
          </div>
        </div>

        <Button variant="outline" className="w-full rounded-full bg-transparent" asChild>
          <Link href="/credits">
            View Credits
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
