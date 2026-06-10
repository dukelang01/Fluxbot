import { Redis } from '@upstash/redis';

export async function GET() {
  const redis = Redis.fromEnv();
  const metrics = await redis.get('fluxbot:metrics') || { pnl: 0, sharpe: 0, drawdown: 0 };
  return Response.json(metrics);
}