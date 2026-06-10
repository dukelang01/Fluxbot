"use client";

import { Activity, Pause, Play, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  running: boolean;
  onToggle: () => void;
  pnl: number;
}

export function TerminalHeader({ running, onToggle, pnl }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
            <Activity className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold tracking-tight text-foreground">
                FluxBot<span className="text-primary">::</span>Terminal
              </h1>
              <span className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
                stat-arb
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              cross-exchange statistical arbitrage engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Wifi className="h-3.5 w-3.5 text-primary" aria-hidden />
            <span>6 venues</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                running ? "bg-primary animate-pulse-signal" : "bg-muted-foreground",
              )}
              aria-hidden
            />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {running ? "live" : "paused"}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={!running}
            aria-label={running ? "Pause feed" : "Resume feed"}
            className="flex h-9 min-w-[44px] items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{running ? "Pause" : "Resume"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
