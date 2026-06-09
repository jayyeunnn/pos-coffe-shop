import type { DailyStats, WeeklyRevenueData, RecentOrder } from "@/types";
import { mockOrders, mockOrderItems, mockProfiles } from "@/lib/mock/data";

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function isSameDay(iso: string, ref: Date): boolean {
  return new Date(iso).toDateString() === ref.toDateString();
}

/** Statistik hari ini: revenue, jumlah transaksi, item terlaris, rata-rata. */
export async function getDailyStats(): Promise<DailyStats> {
  const today = new Date();
  const todayOrders = mockOrders.filter(
    (o) => o.status === "completed" && isSameDay(o.created_at, today),
  );
  const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const transactionCount = todayOrders.length;

  const orderIds = new Set(todayOrders.map((o) => o.id));
  const qtyByName = new Map<string, number>();
  for (const it of mockOrderItems) {
    if (orderIds.has(it.order_id)) {
      qtyByName.set(it.name, (qtyByName.get(it.name) ?? 0) + it.quantity);
    }
  }
  let topItem: DailyStats["topItem"] = null;
  Array.from(qtyByName.entries()).forEach(([name, quantity]) => {
    if (!topItem || quantity > topItem.quantity) topItem = { name, quantity };
  });

  return {
    totalRevenue,
    transactionCount,
    topItem,
    averagePerTransaction: transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0,
  };
}

/** Revenue 7 hari terakhir (untuk BarChart). */
export async function getWeeklyRevenue(): Promise<WeeklyRevenueData[]> {
  const result: WeeklyRevenueData[] = [];
  const now = new Date();
  for (let offset = 6; offset >= 0; offset--) {
    const day = new Date(now);
    day.setDate(now.getDate() - offset);
    const dayOrders = mockOrders.filter(
      (o) => o.status === "completed" && isSameDay(o.created_at, day),
    );
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    result.push({
      date: `${yyyy}-${mm}-${dd}`,
      label: DAY_LABELS[day.getDay()],
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      transactionCount: dayOrders.length,
    });
  }
  return result;
}

/** N order terbaru (dashboard recent list). */
export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  return mockOrders
    .slice()
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, limit)
    .map((o) => {
      const itemCount = mockOrderItems
        .filter((it) => it.order_id === o.id)
        .reduce((sum, it) => sum + it.quantity, 0);
      return {
        id: o.id,
        orderNumber: o.order_number,
        cashierName: mockProfiles.find((p) => p.id === o.cashier_id)?.full_name ?? "—",
        itemCount,
        total: o.total,
        paymentMethod: o.payment_method,
        status: o.status,
        createdAt: o.created_at,
      };
    });
}
