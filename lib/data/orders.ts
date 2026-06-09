import type { Order, OrderItem, CreateOrderPayload, OrderFilters, Profile } from "@/types";
import { mockOrders, mockOrderItems, mockProfiles } from "@/lib/mock/data";
import { generateOrderNumber } from "@/lib/utils";

/**
 * Daftar order dengan filter.
 * RLS-like: kasir hanya lihat order sendiri, owner lihat semua.
 */
export async function getOrders(currentUser: Profile, filters: OrderFilters = {}): Promise<Order[]> {
  let rows = mockOrders.slice();

  if (currentUser.role === "cashier") {
    rows = rows.filter((o) => o.cashier_id === currentUser.id);
  }
  if (filters.cashierId) rows = rows.filter((o) => o.cashier_id === filters.cashierId);
  if (filters.status) rows = rows.filter((o) => o.status === filters.status);
  if (filters.paymentMethod) rows = rows.filter((o) => o.payment_method === filters.paymentMethod);
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).setHours(0, 0, 0, 0);
    rows = rows.filter((o) => +new Date(o.created_at) >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).setHours(23, 59, 59, 999);
    rows = rows.filter((o) => +new Date(o.created_at) <= to);
  }

  return rows
    .map((o) => ({ ...o, profiles: mockProfiles.find((p) => p.id === o.cashier_id) ?? null }))
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

/** Detail order + order_items. */
export async function getOrderById(id: string, currentUser: Profile): Promise<Order | null> {
  const order = mockOrders.find((o) => o.id === id);
  if (!order) return null;
  if (currentUser.role === "cashier" && order.cashier_id !== currentUser.id) return null;

  return {
    ...order,
    profiles: mockProfiles.find((p) => p.id === order.cashier_id) ?? null,
    order_items: mockOrderItems.filter((it) => it.order_id === order.id),
  };
}

function todayOrderCount(): number {
  const todayKey = new Date().toDateString();
  return mockOrders.filter((o) => new Date(o.created_at).toDateString() === todayKey).length;
}

/**
 * Buat order baru + order_items (snapshot nama & harga).
 * Generate order number BRW-YYYYMMDD-XXX server-side.
 */
export async function createOrder(payload: CreateOrderPayload, cashier: Profile): Promise<Order> {
  const now = new Date();
  const sequence = todayOrderCount() + 1;
  const orderNumber = generateOrderNumber(sequence, now);
  const orderId = `order-${now.getTime()}`;

  const order: Order = {
    id: orderId,
    order_number: orderNumber,
    cashier_id: cashier.id,
    status: "completed",
    payment_method: payload.paymentMethod,
    subtotal: payload.subtotal,
    total: payload.total,
    cash_received: payload.cashReceived ?? null,
    change_amount: payload.changeAmount ?? null,
    notes: payload.notes ?? null,
    created_at: now.toISOString(),
    profiles: cashier,
  };

  const items: OrderItem[] = payload.items.map((it, idx) => ({
    id: `oi-${orderId}-${idx}`,
    order_id: orderId,
    menu_item_id: it.menuItemId,
    name: it.name, // snapshot
    unit_price: it.unitPrice, // snapshot
    quantity: it.quantity,
    subtotal: it.subtotal,
    notes: it.notes ?? null,
  }));

  mockOrders.unshift(order);
  mockOrderItems.push(...items);

  return { ...order, order_items: items };
}
