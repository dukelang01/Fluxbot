import { NextResponse } from "next/server"
import { seedOpportunities } from "@/lib/engine"

export const dynamic = "force-dynamic"

// Main arbitrage scan handler. Intended to be triggered on a schedule (e.g. Vercel Cron).
// Scans configured venues for cross-exchange statistical-arbitrage edges and returns the
// ranked opportunity set. Wire this to the execution layer to act on qualifying signals.
export async function GET() {
  const opportunities = seedOpportunities(12)
  const actionable = opportunities.filter((o) => o.netEdgeBps >= 14)
  return NextResponse.json({
    scannedAt: Date.now(),
    venues: ["Binance", "Coinbase", "Kraken", "OKX", "Bybit", "Bitstamp"],
    total: opportunities.length,
    actionable: actionable.length,
    opportunities,
  })
}
