"use server";

import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/lib/data/orders";
import type { Order } from "@/types";

export async function getOrderDetailAction(orderId: string): Promise<Order | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getOrderById(orderId, user);
}
