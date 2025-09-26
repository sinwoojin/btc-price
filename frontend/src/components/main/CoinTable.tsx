"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, TrendingDown } from "lucide-react"

interface CoinData {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  market_cap_rank: number
  image: string
}

export function CoinTable() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchCoins = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
      )
      const data = await response.json()
      setCoins(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching coins:", error)
      setLoading(false)
    }
  }

  const toggleFavorite = (coinId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(coinId)) {
      newFavorites.delete(coinId)
    } else {
      newFavorites.add(coinId)
    }
    setFavorites(newFavorites)
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`
    if (price < 1) return `$${price.toFixed(4)}`
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Cryptocurrencies by Market Cap</span>
          <Badge variant="secondary">Live Data</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                <th className="text-right p-4 font-medium text-muted-foreground">24h %</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Market Cap</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Volume (24h)</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(coin.id)} className="p-1 h-auto">
                        <Star
                          className={`w-4 h-4 ${
                            favorites.has(coin.id) ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <span className="font-medium">{coin.market_cap_rank}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-muted-foreground uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono">{formatPrice(coin.current_price)}</td>
                  <td className="p-4 text-right">
                    <div
                      className={`flex items-center justify-end ${
                        coin.price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono">{formatMarketCap(coin.market_cap)}</td>
                  <td className="p-4 text-right font-mono">{formatMarketCap(coin.total_volume)}</td>
                  <td className="p-4 text-center">
                    <Button size="sm" variant="outline">
                      Trade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
