"use client";

import type { Trade, TradeStatus } from "@/lib/types";
import { cn, formatNum, formatTime, formatUsd } from "@/lib/utils";

interface Props {
  trades: Trade[];
}

const statusStyles: Record<TradeStatus, string> = {
  open: "border-signal/40 text-signal",
  filled: "border-primary/40 text-primary",
  closed: "border-border text-muted-foreground",
  rejected: "border-loss/40 text-loss",
};

export function TradesPanel({ trades }: Props) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">Executions</h2>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          latest fills
        </span>
      </div>
      <div className="scroll-thin max-h-[360px] overflow-y-auto">
        <ul className="divide-y divide-border/60 font-mono text-xs">
          {trades.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-2.5 tabular-nums">
              <span
                className={cn(
                  "w-12 shrink-0 text-[10px] font-semibold uppercase",
                  t.side === "long" ? "text-profit" : "text-loss",
                )}
              >
                {t.side}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{t.symbol}</span>
                  <span className="truncate text-muted-foreground">{t.venue}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {formatNum(t.entry, t.entry > 100 ? 2 : 4)}
                  {t.exit ? ` → ${formatNum(t.exit, t.exit > 100 ? 2 : 4)}` : ""} · {formatTime(t.timestamp)}
                </div>
              </div>
              <span
                className={cn(
                  "rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                  statusStyles[t.status],
                )}
              >
                {t.status}
              </span>
              <span
                className={cn(
                  "w-20 shrink-0 text-right font-semibold",
                  t.pnl > 0 ? "text-profit" : t.pnl < 0 ? "text-loss" : "text-muted-foreground",
                )}
              >
                {t.status === "closed" ? formatUsd(t.pnl, { sign: true }) : "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
