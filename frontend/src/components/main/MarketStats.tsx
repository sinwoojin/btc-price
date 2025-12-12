"use client"

import { Card, CardContent } from "@components/ui/card"
import { Activity, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"

interface MarketData {
  totalMarketCap: number
  totalVolume: number
  btcDominance: number
  activeCryptocurrencies: number
  marketCapChange: number
  volumeChange: number
}

export function MarketStats() {
  const [marketData, _] = useState<MarketData>({
    totalMarketCap: 2847392847392,
    totalVolume: 89473829473,
    btcDominance: 52.3,
    activeCryptocurrencies: 13847,
    marketCapChange: 2.4,
    volumeChange: -5.2,
  })

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const formatPercentage = (num: number) => {
    const isPositive = num >= 0
    return (
      <span className={`flex items-center ${isPositive ? "text-success" : "text-destructive"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(num).toFixed(2)}%
      </span>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
              <p className="text-2xl font-bold">{formatNumber(marketData.totalMarketCap)}</p>
              <div className="mt-1">{formatPercentage(marketData.marketCapChange)}</div>
            </div>
            <DollarSign className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-bold">{formatNumber(marketData.totalVolume)}</p>
              <div className="mt-1">{formatPercentage(marketData.volumeChange)}</div>
            </div>
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">BTC Dominance</p>
              <p className="text-2xl font-bold">{marketData.btcDominance}%</p>
              <p className="text-sm text-muted-foreground mt-1">Bitcoin market share</p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">₿</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Coins</p>
              <p className="text-2xl font-bold">{marketData.activeCryptocurrencies.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Cryptocurrencies</p>
            </div>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-xs">#</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
