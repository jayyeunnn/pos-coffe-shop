"use server";

import { createOrder } from "@/lib/data/orders";
import { getCurrentUser } from "@/lib/auth";
import type { CreateOrderPayload, Order } from "@/types";

export async function createOrderAction(payload: CreateOrderPayload): Promise<Order> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Tidak terautentikasi");
  return createOrder(payload, user);
}
