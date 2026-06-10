"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LogEntry, Metrics, Opportunity, PnlPoint, Trade } from "@/lib/types";
import {
  computeMetrics,
  makeLog,
  makeOpportunity,
  makeTrade,
  seedLogs,
  seedOpportunities,
  seedPnlSeries,
  seedTrades,
} from "@/lib/engine";

const MAX_OPPS = 12;
const MAX_TRADES = 40;
const MAX_LOGS = 120;
const MAX_PNL = 90;

export function useLiveFeed() {
  const [running, setRunning] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pnlSeries, setPnlSeries] = useState<PnlPoint[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    pnl: 0,
    pnl24h: 0,
    sharpe: 0,
    maxDrawdown: 0,
    winRate: 0,
    openPositions: 0,
    totalTrades: 0,
    capitalDeployed: 0,
  });

  const runningRef = useRef(running);
  runningRef.current = running;

  // Seed once on mount (client-side to avoid hydration mismatch on timestamps)
  useEffect(() => {
    const opps = seedOpportunities();
    const tr = seedTrades();
    const pnl = seedPnlSeries();
    setOpportunities(opps);
    setTrades(tr);
    setLogs(seedLogs());
    setPnlSeries(pnl);
    setMetrics(computeMetrics(pnl, tr));
  }, []);

  // Opportunity ticker
  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return;
      const now = Date.now();
      const opp = makeOpportunity(now);
      setOpportunities((prev) => [opp, ...prev].slice(0, MAX_OPPS));
      setLogs((prev) => [makeLog(now, opp), ...prev].slice(0, MAX_LOGS));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Trade + metrics ticker
  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return;
      const now = Date.now();
      const tr = makeTrade(now);
      setTrades((prev) => {
        const next = [tr, ...prev].slice(0, MAX_TRADES);
        setPnlSeries((series) => {
          const last = series[series.length - 1];
          const delta = tr.pnl || (Math.random() - 0.42) * 220;
          const point: PnlPoint = {
            t: new Date(now).toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            pnl: +((last?.pnl ?? 0) + delta).toFixed(2),
            equity: +((last?.equity ?? 100000) + delta).toFixed(2),
          };
          const nextSeries = [...series, point].slice(-MAX_PNL);
          setMetrics(computeMetrics(nextSeries, next));
          return nextSeries;
        });
        return next;
      });
      if (tr.status === "closed" || tr.status === "filled") {
        setLogs((prev) => [makeLog(now), ...prev].slice(0, MAX_LOGS));
      }
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const toggle = useCallback(() => setRunning((r) => !r), []);

  return { running, toggle, opportunities, trades, logs, pnlSeries, metrics };
}
