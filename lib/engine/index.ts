import type {
  Exchange,
  LogEntry,
  LogLevel,
  Metrics,
  Opportunity,
  PnlPoint,
  Side,
  Trade,
  TradeStatus,
} from "@/lib/types";

const EXCHANGES: Exchange[] = ["Binance", "Coinbase", "Kraken", "OKX", "Bybit", "Bitstamp"];

const SYMBOLS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT", "LINK/USDT", "ARB/USDT", "OP/USDT", "DOGE/USDT"];

const BASE_PRICES: Record<string, number> = {
  "BTC/USDT": 67250,
  "ETH/USDT": 3520,
  "SOL/USDT": 168,
  "AVAX/USDT": 38.4,
  "LINK/USDT": 17.85,
  "ARB/USDT": 1.12,
  "OP/USDT": 2.34,
  "DOGE/USDT": 0.158,
};

let seed = 1337;
/** deterministic-ish PRNG so server and first render stay stable, then evolves */
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function twoVenues(): [Exchange, Exchange] {
  const a = pick(EXCHANGES);
  let b = pick(EXCHANGES);
  while (b === a) b = pick(EXCHANGES);
  return [a, b];
}

let oppCounter = 0;

export function makeOpportunity(now = Date.now()): Opportunity {
  const symbol = pick(SYMBOLS);
  const base = BASE_PRICES[symbol];
  const [buyVenue, sellVenue] = twoVenues();
  const drift = (rand() - 0.5) * 0.0004;
  const buyPrice = base * (1 + drift);
  const spreadBps = 4 + rand() * 46; // 4 - 50 bps
  const sellPrice = buyPrice * (1 + spreadBps / 10000);
  const feeBps = 6 + rand() * 4;
  const netEdgeBps = spreadBps - feeBps;
  const zScore = +(1.4 + rand() * 2.8).toFixed(2);
  const size = +(base > 1000 ? 0.1 + rand() * 1.5 : 50 + rand() * 800).toFixed(3);
  oppCounter += 1;
  return {
    id: `op_${now}_${oppCounter}`,
    symbol,
    buyVenue,
    sellVenue,
    buyPrice: +buyPrice.toFixed(buyPrice > 100 ? 2 : 4),
    sellPrice: +sellPrice.toFixed(sellPrice > 100 ? 2 : 4),
    spreadBps: +spreadBps.toFixed(1),
    netEdgeBps: +netEdgeBps.toFixed(1),
    zScore,
    size,
    timestamp: now,
  };
}

let tradeCounter = 0;

export function makeTrade(now = Date.now()): Trade {
  const symbol = pick(SYMBOLS);
  const base = BASE_PRICES[symbol];
  const side: Side = rand() > 0.5 ? "long" : "short";
  const venue = pick(EXCHANGES);
  const entry = base * (1 + (rand() - 0.5) * 0.002);
  const statuses: TradeStatus[] = ["open", "filled", "closed", "closed", "rejected"];
  const status = statuses[Math.floor(rand() * statuses.length)];
  const closed = status === "closed";
  const move = (rand() - 0.42) * 0.012;
  const exit = closed ? entry * (1 + move) : null;
  const size = +(base > 1000 ? 0.05 + rand() * 0.8 : 20 + rand() * 400).toFixed(3);
  const pnl = closed && exit ? +((exit - entry) * size * (side === "long" ? 1 : -1)).toFixed(2) : 0;
  tradeCounter += 1;
  return {
    id: `tx_${now}_${tradeCounter}`,
    symbol,
    side,
    venue,
    entry: +entry.toFixed(entry > 100 ? 2 : 4),
    exit: exit ? +exit.toFixed(exit > 100 ? 2 : 4) : null,
    size,
    pnl,
    status,
    timestamp: now,
  };
}

const LOG_TEMPLATES: { level: LogLevel; build: (o?: Opportunity) => string }[] = [
  { level: "signal", build: (o) => `z-score breach ${o?.zScore ?? "2.10"}σ on ${o?.symbol ?? "ETH/USDT"} — ${o?.buyVenue}→${o?.sellVenue}` },
  { level: "exec", build: (o) => `fill ${o?.symbol ?? "BTC/USDT"} ${o?.size ?? "0.25"} @ ${o?.buyVenue ?? "Binance"}` },
  { level: "info", build: () => `orderbook sync ok · latency ${(8 + rand() * 22).toFixed(0)}ms` },
  { level: "info", build: (o) => `net edge ${o?.netEdgeBps ?? "12.4"}bps after fees` },
  { level: "warn", build: () => `widening spread, requeue · slippage guard armed` },
  { level: "exec", build: (o) => `position closed ${o?.symbol ?? "SOL/USDT"} pnl ${(rand() * 60 - 10).toFixed(2)}` },
  { level: "error", build: () => `rate limit ${pick(EXCHANGES)} — backing off 250ms` },
];

let logCounter = 0;

export function makeLog(now = Date.now(), opp?: Opportunity): LogEntry {
  const t = LOG_TEMPLATES[Math.floor(rand() * LOG_TEMPLATES.length)];
  logCounter += 1;
  return {
    id: `log_${now}_${logCounter}`,
    ts: now,
    level: t.level,
    msg: t.build(opp),
  };
}

export function seedOpportunities(count = 9): Opportunity[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => makeOpportunity(now - i * 1700)).sort(
    (a, b) => b.netEdgeBps - a.netEdgeBps,
  );
}

export function seedTrades(count = 14): Trade[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => makeTrade(now - i * 9000));
}

export function seedLogs(count = 16): LogEntry[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => makeLog(now - (count - i) * 2200)).reverse();
}

export function seedPnlSeries(points = 60): PnlPoint[] {
  let equity = 100000;
  let cum = 0;
  const out: PnlPoint[] = [];
  const start = Date.now() - points * 60_000;
  for (let i = 0; i < points; i++) {
    const step = (rand() - 0.4) * 380;
    cum += step;
    equity += step;
    const d = new Date(start + i * 60_000);
    out.push({
      t: d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      pnl: +cum.toFixed(2),
      equity: +equity.toFixed(2),
    });
  }
  return out;
}

export function computeMetrics(pnlSeries: PnlPoint[], trades: Trade[]): Metrics {
  const last = pnlSeries[pnlSeries.length - 1];
  const closed = trades.filter((t) => t.status === "closed");
  const wins = closed.filter((t) => t.pnl > 0).length;
  const peak = Math.max(...pnlSeries.map((p) => p.equity));
  const trough = Math.min(...pnlSeries.slice(pnlSeries.findIndex((p) => p.equity === peak)).map((p) => p.equity));
  const maxDrawdown = peak > 0 ? ((peak - trough) / peak) * 100 : 0;
  const open = trades.filter((t) => t.status === "open" || t.status === "filled").length;
  return {
    pnl: last?.pnl ?? 0,
    pnl24h: +(pnlSeries.length > 1 ? last.pnl - pnlSeries[0].pnl : 0).toFixed(2),
    sharpe: +(1.8 + rand() * 1.3).toFixed(2),
    maxDrawdown: +maxDrawdown.toFixed(2),
    winRate: closed.length ? +((wins / closed.length) * 100).toFixed(1) : 0,
    openPositions: open,
    totalTrades: trades.length,
    capitalDeployed: +(open * (24000 + rand() * 12000)).toFixed(0),
  };
}
