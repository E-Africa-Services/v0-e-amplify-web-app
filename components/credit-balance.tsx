import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, ArrowUpRight } from "lucide-react"

export function CreditBalance() {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Your Balance</h2>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Coins className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-5xl font-bold mb-2">125</div>
          <div className="text-sm text-muted-foreground">Available Credits</div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">This Month</span>
            <span className="font-semibold">+50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Used</span>
            <span className="font-semibold">-25</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Earned</span>
            <span className="font-semibold text-primary">+100</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/10 text-secondary-foreground">
          <TrendingUp className="w-4 h-4 text-secondary" />
          <span className="text-xs">You're earning more than spending!</span>
        </div>

        <Button className="w-full rounded-full">
          Purchase More Credits
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  )
}
