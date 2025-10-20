"use client"

import { useState } from "react"
import { FeedNavbar } from "@/components/feed-navbar"
import { MentorCard } from "@/components/mentor-card"
import { DiscoveryFilters } from "@/components/discovery-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

// Mock mentor data
const mockMentors = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Product Designer",
    avatar: "/professional-woman-smiling.png",
    skills: ["UI/UX", "Figma", "Design Systems", "User Research"],
    bio: "10+ years designing products that people love. Passionate about mentoring the next generation of designers.",
    rating: 4.9,
    sessions: 127,
    price: 50,
    availability: "Available Now",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Lead Software Engineer",
    avatar: "/professional-man-smiling.png",
    skills: ["React", "Node.js", "TypeScript", "System Design"],
    bio: "Full-stack engineer with a passion for clean code and mentoring. Let's build something amazing together.",
    rating: 5.0,
    sessions: 203,
    price: 75,
    availability: "Available Today",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "Marketing Director",
    avatar: "/professional-woman-confident.jpg",
    skills: ["Content Strategy", "SEO", "Analytics", "Brand Building"],
    bio: "Helped 50+ startups scale their marketing. Ready to share proven strategies that work.",
    rating: 4.8,
    sessions: 89,
    price: 60,
    availability: "Tomorrow",
    isAvailable: false,
  },
  {
    id: "4",
    name: "Alex Rivera",
    role: "Data Scientist",
    avatar: "/placeholder.svg?height=200&width=200",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
    bio: "Making data science accessible. Specializing in practical ML applications for real-world problems.",
    rating: 4.9,
    sessions: 156,
    price: 65,
    availability: "Available Now",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Emma Wilson",
    role: "UX Researcher",
    avatar: "/placeholder.svg?height=200&width=200",
    skills: ["User Research", "Usability Testing", "Qualitative Analysis"],
    bio: "15 years of user research experience. Let's uncover insights that drive better product decisions.",
    rating: 5.0,
    sessions: 94,
    price: 55,
    availability: "Available Today",
    isAvailable: true,
  },
  {
    id: "6",
    name: "James Lee",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=200&width=200",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    bio: "Cloud infrastructure expert. I'll help you build scalable, reliable systems from the ground up.",
    rating: 4.7,
    sessions: 112,
    price: 70,
    availability: "Tomorrow",
    isAvailable: false,
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    availability: "all",
    priceRange: [0, 100],
    rating: 0,
    skills: [] as string[],
  })

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAvailability = filters.availability === "all" || (filters.availability === "now" && mentor.isAvailable)

    const matchesPrice = mentor.price >= filters.priceRange[0] && mentor.price <= filters.priceRange[1]

    const matchesRating = mentor.rating >= filters.rating

    return matchesSearch && matchesAvailability && matchesPrice && matchesRating
  })

  return (
    <div className="min-h-screen bg-background">
      <FeedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Mentors</h1>
          <p className="text-muted-foreground">Find the perfect mentor to help you grow</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-2xl"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-2xl bg-transparent"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && <DiscoveryFilters filters={filters} setFilters={setFilters} />}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMentors.length} of {mockMentors.length} mentors
          </p>
        </div>

        {/* Mentor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No mentors found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilters({
                  availability: "all",
                  priceRange: [0, 100],
                  rating: 0,
                  skills: [],
                })
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
