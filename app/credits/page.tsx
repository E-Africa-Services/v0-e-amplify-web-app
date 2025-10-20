import { FeedNavbar } from "@/components/feed-navbar"
import { CreditBalance } from "@/components/credit-balance"
import { CreditPackages } from "@/components/credit-packages"
import { CreditHistory } from "@/components/credit-history"

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-background">
      <FeedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Credits</h1>
          <p className="text-muted-foreground">Manage your credits and purchase more</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <CreditPackages />
            <CreditHistory />
          </div>

          {/* Right Column - 1/3 width */}
          <div>
            <CreditBalance />
          </div>
        </div>
      </div>
    </div>
  )
}
