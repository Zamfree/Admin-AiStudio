'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

// In the future, replace this with a real database query or analytics view.
// Example: const { data } = await supabase.from('analytics_trends').select('*').order('date', { ascending: true });
const MOCK_TREND_DATA = [
  { date: "Mar 12", rebate: 1200, volume: 450000 },
  { date: "Mar 13", rebate: 1500, volume: 520000 },
  { date: "Mar 14", rebate: 1100, volume: 410000 },
  { date: "Mar 15", rebate: 1800, volume: 600000 },
  { date: "Mar 16", rebate: 2200, volume: 750000 },
  { date: "Mar 17", rebate: 1900, volume: 680000 },
  { date: "Mar 18", rebate: 2500, volume: 820000 },
];

export function DashboardTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={MOCK_TREND_DATA}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar yAxisId="left" dataKey="rebate" name="Rebates ($)" fill="#0f172a" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="volume" name="Volume" fill="#94a3b8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
