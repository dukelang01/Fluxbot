"use client";

import { ArrowRight } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { cn, formatNum, formatTime } from "@/lib/utils";

interface Props {
  opportunities: Opportunity[];
}

function edgeTone(bps: number) {
  if (bps >= 28) return "text-profit";
  if (bps >= 14) return "text-signal";
  return "text-muted-foreground";
}

export function OpportunitiesPanel({ opportunities }: Props) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal animate-pulse-signal" aria-hidden />
          <h2 className="text-sm font-semibold tracking-tight">Live Opportunities</h2>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          sorted by net edge
        </span>
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-2 font-medium">Pair</th>
              <th className="px-4 py-2 font-medium">Route</th>
              <th className="px-4 py-2 text-right font-medium">Buy</th>
              <th className="px-4 py-2 text-right font-medium">Sell</th>
              <th className="px-4 py-2 text-right font-medium">Spread</th>
              <th className="px-4 py-2 text-right font-medium">Net Edge</th>
              <th className="px-4 py-2 text-right font-medium">z</th>
              <th className="px-4 py-2 text-right font-medium">Seen</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {opportunities.map((o, i) => (
              <tr
                key={o.id}
                className={cn(
                  "border-t border-border/60 transition-colors hover:bg-secondary/60",
                  i === 0 && "bg-primary/5",
                )}
              >
                <td className="px-4 py-2 font-semibold text-foreground">{o.symbol}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <span className="text-foreground">{o.buyVenue}</span>
                    <ArrowRight className="h-3 w-3 text-primary" aria-hidden />
                    <span className="text-foreground">{o.sellVenue}</span>
                  </span>
                </td>
                <td className="px-4 py-2 text-right text-muted-foreground">{formatNum(o.buyPrice, o.buyPrice > 100 ? 2 : 4)}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{formatNum(o.sellPrice, o.sellPrice > 100 ? 2 : 4)}</td>
                <td className="px-4 py-2 text-right text-foreground">{formatNum(o.spreadBps, 1)}bps</td>
                <td className={cn("px-4 py-2 text-right font-semibold", edgeTone(o.netEdgeBps))}>
                  {o.netEdgeBps > 0 ? "+" : ""}
                  {formatNum(o.netEdgeBps, 1)}bps
                </td>
                <td className="px-4 py-2 text-right text-signal">{formatNum(o.zScore, 2)}σ</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{formatTime(o.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
