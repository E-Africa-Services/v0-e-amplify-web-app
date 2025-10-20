"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const skills = [
  { name: "React Development", progress: 75, sessions: 12, color: "bg-primary" },
  { name: "UI/UX Design", progress: 60, sessions: 8, color: "bg-secondary" },
  { name: "System Design", progress: 45, sessions: 5, color: "bg-accent" },
  { name: "TypeScript", progress: 85, sessions: 15, color: "bg-primary" },
]

export function SkillProgress() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Skill Progress</h2>
        <span className="text-sm text-muted-foreground">Based on sessions</span>
      </div>

      <div className="space-y-6">
        {skills.map((skill, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">{skill.sessions} sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={skill.progress} className="flex-1" />
              <span className="text-sm font-semibold w-12 text-right">{skill.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
