// ============================================================
// BrewDesk — Mock Data (mirror dari supabase/seed.sql)
// Sumber kebenaran data saat NEXT_PUBLIC_DATA_MODE=mock.
// In-memory, session-lived. Order baru dari POS di-push ke sini.
// Saat integrasi Supabase: file ini tidak dipakai, repository
// di lib/data/* ganti body-nya jadi query Supabase.
// ============================================================

import type {
  Category,
  MenuItem,
  Order,
  OrderItem,
  Profile,
  CafeSettings,
  PaymentMethod,
} from "@/types";

// ---- PROFILES (1 owner + 2 kasir) ----
export const OWNER_ID = "00000000-0000-0000-0000-0000000000o1";
export const KASIR1_ID = "00000000-0000-0000-0000-0000000000k1";
export const KASIR2_ID = "00000000-0000-0000-0000-0000000000k2";

export const mockProfiles: Profile[] = [
  { id: OWNER_ID, full_name: "Riza Fauzan", role: "owner", is_active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: KASIR1_ID, full_name: "Dinda Pratiwi", role: "cashier", is_active: true, created_at: "2026-01-02T00:00:00Z" },
  { id: KASIR2_ID, full_name: "Reza Ananda", role: "cashier", is_active: true, created_at: "2026-01-03T00:00:00Z" },
];

/** Mapping email -> profile untuk mock auth (login). */
export const mockCredentials: Record<string, { password: string; profileId: string }> = {
  "owner@brewdesk.app": { password: "demo123456", profileId: OWNER_ID },
  "dinda@brewdesk.app": { password: "demo123456", profileId: KASIR1_ID },
  "reza@brewdesk.app": { password: "demo123456", profileId: KASIR2_ID },
};

// ---- CATEGORIES (5) ----
const CAT_KOPI = "11111111-0000-0000-0000-000000000001";
const CAT_NONKOPI = "11111111-0000-0000-0000-000000000002";
const CAT_MAKANAN = "11111111-0000-0000-0000-000000000003";
const CAT_MINUMAN = "11111111-0000-0000-0000-000000000004";
const CAT_SEASONAL = "11111111-0000-0000-0000-000000000005";

export const mockCategories: Category[] = [
  { id: CAT_KOPI, name: "Kopi", sort_order: 1, created_at: "2026-01-01T00:00:00Z" },
  { id: CAT_NONKOPI, name: "Non-Kopi", sort_order: 2, created_at: "2026-01-01T00:00:00Z" },
  { id: CAT_MAKANAN, name: "Makanan", sort_order: 3, created_at: "2026-01-01T00:00:00Z" },
  { id: CAT_MINUMAN, name: "Minuman", sort_order: 4, created_at: "2026-01-01T00:00:00Z" },
  { id: CAT_SEASONAL, name: "Seasonal", sort_order: 5, created_at: "2026-01-01T00:00:00Z" },
];

const catById = (id: string | null) => mockCategories.find((c) => c.id === id) ?? null;

// ---- MENU ITEMS (12) ----
const rawMenu: Array<Omit<MenuItem, "categories">> = [
  { id: "22222222-0000-0000-0000-000000000001", name: "Espresso", description: "Shot tunggal arabika pilihan, intense dan balanced.", price: 28000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000002", name: "Café Latte", description: "Espresso dengan susu segar full cream, silky texture.", price: 32000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000003", name: "Cappuccino", description: "Espresso, susu, dan foam yang sempurna.", price: 30000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000004", name: "Americano", description: "Espresso yang diencerkan dengan air panas.", price: 25000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000005", name: "V60 Pour Over", description: "Single origin manual brew, nuanced dan aromatic.", price: 35000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000006", name: "Cold Brew", description: "Kopi cold brew 18 jam, smooth dan tidak pahit.", price: 28000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000007", name: "Flat White", description: "Ristretto double shot dengan susu microfoam.", price: 33000, category_id: CAT_KOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000008", name: "Matcha Latte", description: "Matcha ceremonial grade Jepang dengan susu oat.", price: 30000, category_id: CAT_NONKOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000009", name: "Cokelat Panas", description: "Dark chocolate 70% dengan susu full cream.", price: 28000, category_id: CAT_NONKOPI, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000010", name: "Croissant", description: "Butter croissant premium, fresh dari bakery.", price: 22000, category_id: CAT_MAKANAN, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000011", name: "Banana Bread", description: "Banana bread homemade, moist dan tidak terlalu manis.", price: 25000, category_id: CAT_MAKANAN, image_url: null, is_available: true, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "22222222-0000-0000-0000-000000000012", name: "Pumpkin Spice Latte", description: "Seasonal special — espresso dengan pumpkin spice syrup.", price: 38000, category_id: CAT_SEASONAL, image_url: null, is_available: false, is_deleted: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
];

export const mockMenuItems: MenuItem[] = rawMenu.map((m) => ({ ...m, categories: catById(m.category_id) }));

// ---- CAFE SETTINGS ----
export const mockCafeSettings: CafeSettings = {
  id: "33333333-0000-0000-0000-000000000001",
  cafe_name: "Kopi Nusantara",
  address: "Jl. Kopi No. 12, Bandung",
  phone: "0812-3456-7890",
  footer_note: "Terima kasih sudah mampir! Sampai jumpa lagi ☕",
  updated_at: "2026-01-01T00:00:00Z",
};

// ============================================================
// GENERATE HISTORICAL ORDERS (30 records, 7 hari terakhir)
// Deterministic pseudo-random supaya konsisten antar request.
// ============================================================

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function buildOrders(): { orders: Order[]; items: OrderItem[] } {
  const rng = makeRng(20260609);
  const orders: Order[] = [];
  const items: OrderItem[] = [];
  const availableMenu = mockMenuItems.filter((m) => !m.is_deleted);
  const cashiers = [KASIR1_ID, KASIR2_ID];
  const now = new Date();

  let globalSeq = 1;
  // 7 hari: index 6 = hari ini ... 0 = 6 hari lalu
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const ordersToday = 3 + Math.floor(rng() * 4); // 3-6 order/hari
    let daySeq = 30 + dayOffset; // nomor urut harian (kosmetik)
    for (let i = 0; i < ordersToday; i++) {
      const created = new Date(now);
      created.setDate(now.getDate() - dayOffset);
      created.setHours(8 + Math.floor(rng() * 11), Math.floor(rng() * 60), 0, 0);

      const yyyy = created.getFullYear();
      const mm = String(created.getMonth() + 1).padStart(2, "0");
      const dd = String(created.getDate()).padStart(2, "0");
      const orderNumber = `BRW-${yyyy}${mm}${dd}-${pad3(daySeq--)}`;
      const orderId = `order-${yyyy}${mm}${dd}-${pad3(globalSeq)}`;
      const cashierId = cashiers[Math.floor(rng() * cashiers.length)];

      const lineCount = 1 + Math.floor(rng() * 3); // 1-3 jenis item
      let subtotal = 0;
      const chosen = new Set<string>();
      for (let l = 0; l < lineCount; l++) {
        const menu = availableMenu[Math.floor(rng() * availableMenu.length)];
        if (chosen.has(menu.id)) continue;
        chosen.add(menu.id);
        const qty = 1 + Math.floor(rng() * 3);
        const lineSubtotal = menu.price * qty;
        subtotal += lineSubtotal;
        items.push({
          id: `oi-${globalSeq}-${l}`,
          order_id: orderId,
          menu_item_id: menu.id,
          name: menu.name,
          unit_price: menu.price,
          quantity: qty,
          subtotal: lineSubtotal,
          notes: null,
        });
      }

      const paymentMethod: PaymentMethod = rng() > 0.5 ? "cash" : "qris";
      const total = subtotal;
      const cashReceived = paymentMethod === "cash" ? Math.ceil(total / 5000) * 5000 + (rng() > 0.6 ? 5000 : 0) : null;
      const changeAmount = cashReceived !== null ? cashReceived - total : null;

      orders.push({
        id: orderId,
        order_number: orderNumber,
        cashier_id: cashierId,
        status: "completed",
        payment_method: paymentMethod,
        subtotal,
        total,
        cash_received: cashReceived,
        change_amount: changeAmount,
        notes: null,
        created_at: created.toISOString(),
        profiles: mockProfiles.find((p) => p.id === cashierId) ?? null,
      });
      globalSeq++;
    }
  }
  // urutkan terbaru dulu
  orders.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return { orders, items };
}

const generated = buildOrders();

// Mutable in-memory stores (order baru dari POS di-push ke sini).
export const mockOrders: Order[] = generated.orders;
export const mockOrderItems: OrderItem[] = generated.items;
