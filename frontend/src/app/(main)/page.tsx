import { MarketOverview } from "@components/main/market-overview"
import { MarketHeader } from "@components/main/market-header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MarketHeader />
      <main className="container mx-auto px-4 py-6">
        <MarketOverview />
      </main>
    </div>
  )
}
