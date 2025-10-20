import { Card } from "@/components/ui/card"

export function ProfileSkills({ skills }: { skills: string[] }) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Skills & Expertise</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span key={i} className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </Card>
  )
}
