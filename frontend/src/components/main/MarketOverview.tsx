"use client"
import { Card, CardContent } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { MarketStats } from "./MarketStats"
import { CoinTable } from "./CoinTable"
import { TrendingCoins } from "./TrendingCoins"

export function MarketOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Market Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time cryptocurrency market data and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            Market Open
          </Badge>
        </div>
      </div>

      <MarketStats />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="spot" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="spot">Spot</TabsTrigger>
              <TabsTrigger value="futures">Futures</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
            </TabsList>
            <TabsContent value="spot" className="mt-6">
              <CoinTable />
            </TabsContent>
            <TabsContent value="futures" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">Futures data coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="options" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">Options data coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="defi" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">DeFi data coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <TrendingCoins />
        </div>
      </div>
    </div>
  )
}
