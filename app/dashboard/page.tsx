'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Opportunity {
  id: string;
  symbol: string;
  spread: number;
  netEdge: number;
  timestamp: string;
}

interface Trade {
  id: string;
  symbol: string;
  pnl: number;
  status: string;
}

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState({ pnl: 0, sharpe: 0, drawdown: 0 });

  useEffect(() => {
    // Fetch from API
    fetch('/api/metrics').then(res => res.json()).then(setMetrics);
    // Similar for others
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">FluxBot Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono">${metrics.pnl.toFixed(2)}</p>
          </CardContent>
        </Card>
        {/* More metric cards */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PnL Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[]}>
                <Line type="monotone" dataKey="pnl" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
