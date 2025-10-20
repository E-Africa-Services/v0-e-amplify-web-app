import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Gift } from "lucide-react"

const transactions = [
  {
    id: "1",
    type: "earned",
    description: "Mentorship session with Alex Rivera",
    amount: 50,
    timestamp: "2 hours ago",
    icon: ArrowUpRight,
    color: "text-green-600",
  },
  {
    id: "2",
    type: "spent",
    description: "Session with Sarah Chen",
    amount: -50,
    timestamp: "1 day ago",
    icon: ArrowDownRight,
    color: "text-red-600",
  },
  {
    id: "3",
    type: "bonus",
    description: "Monthly subscription credits",
    amount: 50,
    timestamp: "3 days ago",
    icon: Gift,
    color: "text-primary",
  },
  {
    id: "4",
    type: "earned",
    description: "Mentorship session with Emma Wilson",
    amount: 50,
    timestamp: "5 days ago",
    icon: ArrowUpRight,
    color: "text-green-600",
  },
  {
    id: "5",
    type: "spent",
    description: "Session with Marcus Johnson",
    amount: -75,
    timestamp: "1 week ago",
    icon: ArrowDownRight,
    color: "text-red-600",
  },
]

export function CreditHistory() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${transaction.color}`}>
                <transaction.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
              </div>
            </div>
            <div className={`text-lg font-bold ${transaction.color}`}>
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
