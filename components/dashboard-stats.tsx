import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Video, DollarSign } from "lucide-react"

interface DashboardStatsProps {
  stats?: {
    sessionsCount: number
    connectionsCount: number
    totalCredits: number
    averageRating: string
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const defaultStats = [
    {
      label: "Total Sessions",
      value: stats?.sessionsCount || "0",
      change: "+12%",
      trend: "up",
      icon: Video,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Connections Made",
      value: stats?.connectionsCount || "0",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Total Earnings",
      value: `$${stats?.totalCredits || "0"}`,
      change: "+23%",
      trend: "up",
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Growth Score",
      value: stats?.averageRating || "0",
      change: "+0.5",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {defaultStats.map((stat, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {stat.change}
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
