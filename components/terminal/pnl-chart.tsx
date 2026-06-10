"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PnlPoint } from "@/lib/types";
import { formatUsd } from "@/lib/utils";

interface Props {
  data: PnlPoint[];
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: PnlPoint }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 font-mono text-xs shadow-lg">
      <div className="text-muted-foreground">{p.t}</div>
      <div className="text-profit">PnL {formatUsd(p.pnl, { sign: true })}</div>
      <div className="text-foreground">Equity {formatUsd(p.equity)}</div>
    </div>
  );
}

export function PnlChart({ data }: Props) {
  const positive = (data[data.length - 1]?.pnl ?? 0) >= 0;
  const stroke = positive ? "hsl(var(--profit))" : "hsl(var(--loss))";

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">Equity Curve</h2>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          cumulative pnl
        </span>
      </div>
      <div className="flex-1 px-2 py-3" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              minTickGap={48}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke={stroke}
              strokeWidth={2}
              fill="url(#pnlFill)"
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
