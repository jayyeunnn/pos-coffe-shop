import { TrendingUp, ShoppingBag, Award, BarChart2 } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getDailyStats, getWeeklyRevenue, getRecentOrders } from "@/lib/data/reports";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { formatRupiah } from "@/lib/utils";

export const metadata = { title: "Dashboard — BrewDesk" };

export default async function ReportsPage() {
  await requireOwner();

  const [stats, weeklyRevenue, recentOrders] = await Promise.all([
    getDailyStats(),
    getWeeklyRevenue(),
    getRecentOrders(5),
  ]);

  const statCards = [
    {
      label: "Revenue Hari Ini",
      value: formatRupiah(stats.totalRevenue),
      icon: TrendingUp,
    },
    {
      label: "Transaksi",
      value: String(stats.transactionCount),
      sub: "order selesai",
      icon: ShoppingBag,
    },
    {
      label: "Item Terlaris",
      value: stats.topItem?.name ?? "—",
      sub: stats.topItem ? `${stats.topItem.quantity}× terjual` : "belum ada data",
      icon: Award,
    },
    {
      label: "Rata-rata",
      value: formatRupiah(stats.averagePerTransaction),
      sub: "per transaksi",
      icon: BarChart2,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-text-primary">
          Revenue 7 Hari Terakhir
        </h2>
        <p className="mb-5 mt-1 text-xs text-text-secondary">
          Total pendapatan per hari (Rupiah)
        </p>
        <RevenueChart data={weeklyRevenue} />
      </div>

      {/* Recent orders */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          Transaksi Terbaru
        </h2>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}
