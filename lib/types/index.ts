export type Exchange = "Binance" | "Coinbase" | "Kraken" | "OKX" | "Bybit" | "Bitstamp";

export type TradeStatus = "open" | "filled" | "closed" | "rejected";

export type Side = "long" | "short";

export interface Opportunity {
  id: string;
  symbol: string;
  buyVenue: Exchange;
  sellVenue: Exchange;
  buyPrice: number;
  sellPrice: number;
  /** raw spread in basis points */
  spreadBps: number;
  /** net edge after fees, in basis points */
  netEdgeBps: number;
  /** statistical z-score of the current spread */
  zScore: number;
  size: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: Side;
  venue: Exchange;
  entry: number;
  exit: number | null;
  size: number;
  pnl: number;
  status: TradeStatus;
  timestamp: number;
}

export interface Metrics {
  pnl: number;
  pnl24h: number;
  sharpe: number;
  maxDrawdown: number;
  winRate: number;
  openPositions: number;
  totalTrades: number;
  capitalDeployed: number;
}

export interface PnlPoint {
  t: string;
  pnl: number;
  equity: number;
}

export type LogLevel = "info" | "signal" | "exec" | "warn" | "error";

export interface LogEntry {
  id: string;
  ts: number;
  level: LogLevel;
  msg: string;
}
