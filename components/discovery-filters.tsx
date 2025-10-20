"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Filters {
  availability: string
  priceRange: number[]
  rating: number
  skills: string[]
}

interface DiscoveryFiltersProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

export function DiscoveryFilters({ filters, setFilters }: DiscoveryFiltersProps) {
  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Availability */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Availability</Label>
          <RadioGroup
            value={filters.availability}
            onValueChange={(value) => setFilters({ ...filters, availability: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">
                All Mentors
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now" className="font-normal cursor-pointer">
                Available Now
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Minimum Rating */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Minimum Rating: {filters.rating || "Any"}</Label>
          <Slider
            value={[filters.rating]}
            onValueChange={(value) => setFilters({ ...filters, rating: value[0] })}
            min={0}
            max={5}
            step={0.5}
            className="mt-2"
          />
        </div>
      </div>

      {/* Reset Filters */}
      <div className="mt-6 pt-6 border-t border-border flex justify-end">
        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              availability: "all",
              priceRange: [0, 100],
              rating: 0,
              skills: [],
            })
          }
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  )
}
