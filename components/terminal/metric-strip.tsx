"use client";

import type { Metrics } from "@/lib/types";
import { cn, formatNum, formatUsd } from "@/lib/utils";

interface Props {
  metrics: Metrics;
}

function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "profit" | "loss" | "signal";
}) {
  return (
    <div className="flex flex-col gap-1 border-border px-4 py-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono text-lg font-semibold tabular-nums md:text-xl",
          tone === "profit" && "text-profit",
          tone === "loss" && "text-loss",
          tone === "signal" && "text-signal",
          tone === "neutral" && "text-foreground",
        )}
      >
        {value}
      </span>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function MetricStrip({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
      <Stat
        label="Net PnL"
        value={formatUsd(metrics.pnl, { sign: true })}
        tone={metrics.pnl >= 0 ? "profit" : "loss"}
        hint="session cumulative"
      />
      <Stat
        label="PnL 24h"
        value={formatUsd(metrics.pnl24h, { sign: true })}
        tone={metrics.pnl24h >= 0 ? "profit" : "loss"}
        hint="rolling window"
      />
      <Stat label="Sharpe" value={formatNum(metrics.sharpe)} tone="signal" hint="annualized" />
      <Stat
        label="Max DD"
        value={`-${formatNum(metrics.maxDrawdown)}%`}
        tone="loss"
        hint="peak-to-trough"
      />
      <Stat
        label="Win Rate"
        value={`${formatNum(metrics.winRate, 1)}%`}
        tone={metrics.winRate >= 50 ? "profit" : "neutral"}
        hint={`${metrics.totalTrades} trades`}
      />
      <Stat
        label="Deployed"
        value={formatUsd(metrics.capitalDeployed, { decimals: 0 })}
        hint={`${metrics.openPositions} open`}
      />
    </div>
  );
}
