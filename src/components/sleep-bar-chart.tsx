"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDataPoint {
  date: string;
  minutes: number;
  target: number;
}

interface SleepBarChartProps {
  data: ChartDataPoint[];
  targetMinutes: number;
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const minutes = payload[0].value as number;
    const target = payload[0].payload.target as number;
    const diff = minutes - target;
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-primary">{formatHours(minutes)}</p>
        <p className={`text-xs mt-1 ${diff >= 0 ? "text-green-500" : "text-orange-500"}`}>
          {diff >= 0 ? `+${formatHours(diff)} surplus` : `${formatHours(-diff)} short`}
        </p>
      </div>
    );
  }
  return null;
}

export function SleepBarChart({ data, targetMinutes }: SleepBarChartProps) {
  const maxMinutes = Math.max(...data.map((d) => d.minutes), targetMinutes) + 60;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${Math.floor(v / 60)}h`}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          domain={[0, maxMinutes]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
        <ReferenceLine
          y={targetMinutes}
          stroke="var(--primary)"
          strokeDasharray="4 4"
          strokeOpacity={0.6}
          label={{
            value: "Goal",
            position: "right",
            fontSize: 10,
            fill: "var(--primary)",
          }}
        />
        <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.minutes >= targetMinutes
                  ? "var(--primary)"
                  : entry.minutes >= targetMinutes * 0.85
                    ? "var(--chart-4)"
                    : "var(--chart-5)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
