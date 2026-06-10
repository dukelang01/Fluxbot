"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { LogEntry, LogLevel } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

interface Props {
  logs: LogEntry[];
  onCommand: (cmd: string) => void;
}

const levelStyles: Record<LogLevel, string> = {
  info: "text-muted-foreground",
  signal: "text-signal",
  exec: "text-primary",
  warn: "text-accent",
  error: "text-loss",
};

const levelTag: Record<LogLevel, string> = {
  info: "INFO",
  signal: "SIGL",
  exec: "EXEC",
  warn: "WARN",
  error: "ERR ",
};

export function EventLog({ logs, onCommand }: Props) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
  }, [logs]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onCommand(trimmed);
    setValue("");
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-signal" aria-hidden />
          <h2 className="text-sm font-semibold tracking-tight">Signal Log</h2>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          stdout
        </span>
      </div>

      <div
        ref={scrollRef}
        className="scroll-thin flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
        style={{ maxHeight: 280 }}
        aria-live="polite"
      >
        {logs.map((l) => (
          <div key={l.id} className="flex gap-2 py-0.5">
            <span className="shrink-0 text-muted-foreground/70">{formatTime(l.ts)}</span>
            <span className={cn("shrink-0 font-semibold", levelStyles[l.level])}>
              {levelTag[l.level]}
            </span>
            <span className="text-foreground/90">{l.msg}</span>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border px-4 py-2.5">
        <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type a command  ·  help, status, scan, flatten"
          aria-label="Terminal command input"
          className="h-8 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="hidden h-8 items-center rounded border border-border px-2 text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary sm:flex"
        >
          run
        </button>
      </form>
    </section>
  );
}
