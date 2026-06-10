"use client";

import { useCallback, useState } from "react";
import type { LogEntry } from "@/lib/types";
import { useLiveFeed } from "@/lib/hooks/use-live-feed";
import { TerminalHeader } from "@/components/terminal/terminal-header";
import { MetricStrip } from "@/components/terminal/metric-strip";
import { OpportunitiesPanel } from "@/components/terminal/opportunities-panel";
import { PnlChart } from "@/components/terminal/pnl-chart";
import { TradesPanel } from "@/components/terminal/trades-panel";
import { EventLog } from "@/components/terminal/event-log";

const HELP = "commands: help · status · scan · flatten · clear";

export function TerminalDashboard() {
  const { running, toggle, opportunities, trades, logs, pnlSeries, metrics } = useLiveFeed();
  const [cmdLogs, setCmdLogs] = useState<LogEntry[]>([]);

  const handleCommand = useCallback(
    (cmd: string) => {
      const now = Date.now();
      const base: Omit<LogEntry, "msg" | "level"> = { id: `cmd_${now}_${Math.random()}`, ts: now };
      const lc = cmd.toLowerCase();
      let entry: LogEntry;

      if (lc === "clear") {
        setCmdLogs([]);
        return;
      } else if (lc === "help") {
        entry = { ...base, level: "info", msg: HELP };
      } else if (lc === "status") {
        entry = {
          ...base,
          level: "info",
          msg: `engine ${running ? "LIVE" : "PAUSED"} · pnl ${metrics.pnl.toFixed(2)} · sharpe ${metrics.sharpe} · ${metrics.openPositions} open`,
        };
      } else if (lc === "scan") {
        entry = {
          ...base,
          level: "signal",
          msg: `manual scan · ${opportunities.length} live edges · top ${opportunities[0]?.symbol ?? "—"} @ ${opportunities[0]?.netEdgeBps ?? 0}bps`,
        };
      } else if (lc === "flatten") {
        entry = { ...base, level: "warn", msg: "flatten requested · closing all open positions" };
      } else {
        entry = { ...base, level: "error", msg: `unknown command: "${cmd}" — try "help"` };
      }
      setCmdLogs((prev) => [entry, ...prev].slice(0, 40));
    },
    [running, metrics, opportunities],
  );

  const mergedLogs = [...cmdLogs, ...logs]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 120);

  return (
    <main className="min-h-screen bg-background">
      <div className="terminal-grid">
        <TerminalHeader running={running} onToggle={toggle} pnl={metrics.pnl} />
        <MetricStrip metrics={metrics} />

        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OpportunitiesPanel opportunities={opportunities} />
          </div>
          <div className="lg:col-span-1">
            <PnlChart data={pnlSeries} />
          </div>

          <div className="lg:col-span-2">
            <EventLog logs={mergedLogs} onCommand={handleCommand} />
          </div>
          <div className="lg:col-span-1">
            <TradesPanel trades={trades} />
          </div>
        </div>

        <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-muted-foreground md:px-6">
          FluxBot Terminal · simulated market data for demonstration · not financial advice
        </footer>
      </div>
    </main>
  );
}
