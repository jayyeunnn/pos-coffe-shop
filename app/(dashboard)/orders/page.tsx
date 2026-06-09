import { requireUser } from "@/lib/auth";
import { getOrders } from "@/lib/data/orders";
import { OrdersInterface } from "@/components/orders/OrdersInterface";

export const metadata = { title: "Riwayat Order — BrewDesk" };

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getOrders(user, {});

  return <OrdersInterface orders={orders} />;
}
