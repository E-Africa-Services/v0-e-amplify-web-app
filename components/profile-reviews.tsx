import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    id: "1",
    author: "Alex Rivera",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Sarah is an incredible mentor! Her insights on design systems completely transformed how I approach component architecture. Highly recommend!",
  },
  {
    id: "2",
    author: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "1 month ago",
    comment:
      "Patient, knowledgeable, and genuinely invested in my growth. The session on user research methodologies was exactly what I needed.",
  },
  {
    id: "3",
    author: "James Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "1 month ago",
    comment: "Great session on Figma best practices. Would love to dive deeper into prototyping in our next session!",
  },
]

export function ProfileReviews() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-start gap-4">
              <img
                src={review.avatar || "/placeholder.svg"}
                alt={review.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{review.author}</h3>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
