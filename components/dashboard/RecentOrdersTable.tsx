import { Receipt } from "lucide-react";
import { cn, formatRupiah, formatTime } from "@/lib/utils";
import type { RecentOrder } from "@/types";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Receipt className="h-8 w-8 text-border" aria-hidden="true" />
        <p className="text-sm text-text-secondary">Belum ada transaksi hari ini</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {[
              { label: "No. Order", align: "text-left" },
              { label: "Kasir",     align: "text-left" },
              { label: "Items",     align: "text-center" },
              { label: "Total",     align: "text-right" },
              { label: "Metode",    align: "text-center" },
              { label: "Waktu",     align: "text-right" },
            ].map(({ label, align }) => (
              <th
                key={label}
                className={cn(
                  "px-4 py-3 text-xs font-medium uppercase tracking-wide text-text-secondary",
                  align,
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                {order.orderNumber}
              </td>
              <td className="px-4 py-3 text-text-primary">{order.cashierName}</td>
              <td className="px-4 py-3 text-center text-text-secondary">
                {order.itemCount}
              </td>
              <td className="px-4 py-3 text-right font-mono text-text-primary">
                {formatRupiah(order.total)}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    order.paymentMethod === "cash"
                      ? "bg-warning/10 text-warning"
                      : "bg-accent/10 text-accent",
                  )}
                >
                  {order.paymentMethod === "cash" ? "Tunai" : "QRIS"}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-xs text-text-secondary">
                {formatTime(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
