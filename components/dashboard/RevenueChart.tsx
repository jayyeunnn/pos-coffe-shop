"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { formatRupiah } from "@/lib/utils";
import type { WeeklyRevenueData } from "@/types";

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ payload: WeeklyRevenueData }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-2.5 shadow-lg">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-1 font-mono text-sm font-bold text-text-primary">
        {formatRupiah(d.revenue)}
      </p>
      <p className="text-xs text-text-secondary">{d.transactionCount} transaksi</p>
    </div>
  );
}

interface RevenueChartProps {
  data: WeeklyRevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  // Recharts tidak bisa baca CSS custom props — gunakan nilai konkret per tema
  const C = {
    border:          dark ? "#2a2a2a" : "#e4dcd4",
    textSecondary:   dark ? "#8a8580" : "#7a6e65",
    accent:          dark ? "#c8956c" : "#8b4513",
    surfaceRaised:   dark ? "#1c1c1c" : "#f0e8df",
  } as const;

  const hasData = data.some((d) => d.revenue > 0);

  if (!hasData) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-text-secondary">Belum ada data revenue</p>
        <p className="text-xs text-text-secondary">Data akan muncul setelah ada transaksi selesai</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke={C.border}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: C.textSecondary, fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: C.textSecondary, fontSize: 12 }}
          tickFormatter={(v: number) =>
            v === 0 ? "0" : `${Math.round(v / 1000)}k`
          }
          width={36}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: C.surfaceRaised }}
        />
        <Bar
          dataKey="revenue"
          fill={C.accent}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
