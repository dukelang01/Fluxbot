import { NextResponse } from "next/server"
import { computeMetrics, seedPnlSeries, seedTrades } from "@/lib/engine"

export const dynamic = "force-dynamic"

// Returns a fresh snapshot of engine performance metrics.
// In production this would read aggregated state from Redis / the execution layer;
// here it is derived from the simulation engine so the terminal works with no external deps.
export async function GET() {
  const pnlSeries = seedPnlSeries()
  const trades = seedTrades()
  const metrics = computeMetrics(pnlSeries, trades)
  return NextResponse.json({ metrics, pnlSeries, updatedAt: Date.now() })
}
