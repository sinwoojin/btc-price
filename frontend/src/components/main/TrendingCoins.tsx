"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"

interface TrendingCoin {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  price_btc: number
}

export function TrendingCoins() {
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/search/trending")
      const data = await response.json()
      setTrending(data.coins.slice(0, 10))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching trending coins:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-primary" />
          <span>Trending</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trending.map((coin, index) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                {index + 1}
              </Badge>
              <img src={coin.thumb || "/placeholder.svg"} alt={coin.name} className="w-6 h-6 rounded-full" />
              <div>
                <div className="font-medium text-sm">{coin.name}</div>
                <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">#{coin.market_cap_rank || "N/A"}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
