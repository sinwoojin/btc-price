import { MarketOverview } from "@/components/main/MarketOverview";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <MarketOverview />
      </main>
    </div>
  );
}
