import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    image: "/professional-woman-smiling.png",
    content:
      "E-Amplify changed how I approach mentorship. The video sessions feel natural, and the Purpose Feed keeps me inspired every day.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    image: "/professional-man-smiling.png",
    content:
      "I've earned over $5,000 sharing my coding expertise while helping others grow. It's rewarding in every sense.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Marketing Strategist",
    image: "/professional-woman-confident.jpg",
    content:
      "The smart matching connected me with mentors who truly understood my goals. My career trajectory changed in 3 months.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Real stories from our <span className="text-primary">community</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Thousands of people are already amplifying their purpose. Here's what they have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
