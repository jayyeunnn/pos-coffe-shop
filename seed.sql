-- ============================================================
-- BrewDesk — Supabase Seed Data
-- Jalankan SETELAH schema.sql berhasil
-- PERHATIAN: Buat demo users via Supabase Auth Dashboard dulu,
--            lalu copy UUID ke bagian bawah file ini.
-- ============================================================


-- ============================================================
-- STEP 1: Buat users di Supabase Auth Dashboard dulu
-- Authentication → Users → Add User
--
-- User 1 (Owner):
--   Email    : owner@brewdesk.app
--   Password : demo123456
--   role     : owner   (di raw_user_meta_data)
--
-- User 2 (Kasir 1):
--   Email    : dinda@brewdesk.app
--   Password : demo123456
--   role     : cashier
--
-- User 3 (Kasir 2):
--   Email    : reza@brewdesk.app
--   Password : demo123456
--   role     : cashier
--
-- Setelah dibuat, trigger handle_new_user() akan otomatis
-- insert ke tabel profiles. Tapi kamu bisa update manual:
-- ============================================================

-- Update profiles (jalankan setelah buat users di Auth)
-- Ganti UUID di bawah dengan UUID dari Supabase Auth Dashboard
/*
UPDATE profiles SET full_name = 'Riza Fauzan',  role = 'owner'   WHERE id = 'UUID-OWNER-DISINI';
UPDATE profiles SET full_name = 'Dinda Pratiwi', role = 'cashier' WHERE id = 'UUID-KASIR1-DISINI';
UPDATE profiles SET full_name = 'Reza Ananda',   role = 'cashier' WHERE id = 'UUID-KASIR2-DISINI';
*/


-- ============================================================
-- STEP 2: Categories
-- ============================================================

INSERT INTO categories (id, name, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Kopi',     1),
  ('11111111-0000-0000-0000-000000000002', 'Non-Kopi', 2),
  ('11111111-0000-0000-0000-000000000003', 'Makanan',  3),
  ('11111111-0000-0000-0000-000000000004', 'Minuman',  4),
  ('11111111-0000-0000-0000-000000000005', 'Seasonal', 5)
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- STEP 3: Menu Items (12 items)
-- image_url: null untuk MVP — tampilkan emoji placeholder di UI
-- ============================================================

INSERT INTO menu_items (id, name, description, price, category_id, is_available, is_deleted) VALUES
  -- Kopi
  ('22222222-0000-0000-0000-000000000001',
   'Espresso', 'Shot tunggal arabika pilihan, intense dan balanced.',
   28000, '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000002',
   'Café Latte', 'Espresso dengan susu segar full cream, silky texture.',
   32000, '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000003',
   'Cappuccino', 'Espresso, susu, dan foam yang sempurna.',
   30000, '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000004',
   'Americano', 'Espresso yang diencerkan dengan air panas.',
   25000, '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000005',
   'V60 Pour Over', 'Single origin manual brew, nuanced dan aromatic.',
   35000, '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000006',
   'Cold Brew', 'Kopi cold brew 18 jam, smooth dan tidak pahit.',
   28000, '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000007',
   'Flat White', 'Ristretto double shot dengan susu microfoam.',
   33000, '11111111-0000-0000-0000-000000000001', true, false),

  -- Non-Kopi
  ('22222222-0000-0000-0000-000000000008',
   'Matcha Latte', 'Matcha ceremonial grade Jepang dengan susu oat.',
   30000, '11111111-0000-0000-0000-000000000002', true, false),

  ('22222222-0000-0000-0000-000000000009',
   'Cokelat Panas', 'Dark chocolate 70% dengan susu full cream.',
   28000, '11111111-0000-0000-0000-000000000002', true, false),

  -- Makanan
  ('22222222-0000-0000-0000-000000000010',
   'Croissant', 'Butter croissant premium, fresh dari bakery.',
   22000, '11111111-0000-0000-0000-000000000003', true, false),

  ('22222222-0000-0000-0000-000000000011',
   'Banana Bread', 'Banana bread homemade, moist dan tidak terlalu manis.',
   25000, '11111111-0000-0000-0000-000000000003', true, false),

  -- Seasonal (unavailable — contoh item habis)
  ('22222222-0000-0000-0000-000000000012',
   'Pumpkin Spice Latte', 'Seasonal special — espresso dengan pumpkin spice syrup.',
   38000, '11111111-0000-0000-0000-000000000005', false, false)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- STEP 4: Cafe Settings
-- ============================================================

INSERT INTO cafe_settings (cafe_name, address, phone, footer_note)
VALUES (
  'Kopi Nusantara',
  'Jl. Kopi No. 12, Bandung',
  '0812-3456-7890',
  'Terima kasih sudah mampir! Sampai jumpa lagi ☕'
)
ON CONFLICT DO NOTHING;


-- ============================================================
-- STEP 5: Sample Orders (30 records, 7 hari terakhir)
-- Ganti cashier_id dengan UUID kasir yang sudah dibuat
--
-- CATATAN: Jalankan bagian ini SETELAH profiles berhasil di-update
-- Uncomment dan ganti UUID sesuai Auth users yang dibuat
-- ============================================================

/*
-- Helper: set cashier UUIDs
DO $$
DECLARE
  v_kasir1  UUID := 'UUID-KASIR1-DISINI';  -- Dinda Pratiwi
  v_kasir2  UUID := 'UUID-KASIR2-DISINI';  -- Reza Ananda
BEGIN

-- ---- Hari ini (tanggal sekarang) ----
INSERT INTO orders (order_number, cashier_id, status, payment_method, subtotal, total, cash_received, change_amount, created_at)
VALUES
  ('BRW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-042', v_kasir1, 'completed', 'cash',    114000, 114000, 120000, 6000,  NOW() - INTERVAL '10 minutes'),
  ('BRW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-041', v_kasir1, 'completed', 'qris',     60000,  60000,   NULL,   NULL, NOW() - INTERVAL '25 minutes'),
  ('BRW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-040', v_kasir2, 'completed', 'cash',     35000,  35000,  50000, 15000,  NOW() - INTERVAL '45 minutes'),
  ('BRW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-039', v_kasir1, 'completed', 'qris',     90000,  90000,   NULL,   NULL, NOW() - INTERVAL '1 hour'),
  ('BRW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-038', v_kasir2, 'completed', 'cash',     57000,  57000,  60000,  3000,  NOW() - INTERVAL '2 hours');

-- ---- Kemarin ----
INSERT INTO orders (order_number, cashier_id, status, payment_method, subtotal, total, cash_received, change_amount, created_at)
VALUES
  ('BRW-' || TO_CHAR(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-035', v_kasir1, 'completed', 'cash',  68000,  68000, 70000,  2000, NOW() - INTERVAL '1 day 2 hours'),
  ('BRW-' || TO_CHAR(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-034', v_kasir2, 'completed', 'qris',  96000,  96000,  NULL,   NULL, NOW() - INTERVAL '1 day 3 hours'),
  ('BRW-' || TO_CHAR(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-033', v_kasir1, 'completed', 'cash',  30000,  30000, 50000, 20000, NOW() - INTERVAL '1 day 5 hours');

END $$;


-- Order items untuk order hari ini (BRW-XXX-042)
-- Ganti order_id dengan UUID yang di-generate Supabase
-- Cara mudah: ambil dari hasil query: SELECT id FROM orders WHERE order_number LIKE '%042';

-- Alternatif: gunakan CTE untuk dapat UUID order secara dinamis
WITH o AS (SELECT id FROM orders WHERE order_number LIKE '%-042' LIMIT 1)
INSERT INTO order_items (order_id, menu_item_id, name, unit_price, quantity, subtotal)
SELECT
  o.id,
  m.id,
  m.name,
  m.price,
  qty,
  m.price * qty
FROM o, (VALUES
  ('22222222-0000-0000-0000-000000000002'::UUID, 2),  -- Café Latte x2
  ('22222222-0000-0000-0000-000000000001'::UUID, 1),  -- Espresso x1
  ('22222222-0000-0000-0000-000000000010'::UUID, 2)   -- Croissant x2
) AS items(menu_id, qty)
JOIN menu_items m ON m.id = items.menu_id;

*/


-- ============================================================
-- VERIFIKASI — jalankan query ini untuk cek semuanya beres
-- ============================================================
/*
SELECT 'categories' as tbl, COUNT(*) FROM categories
UNION ALL SELECT 'menu_items',   COUNT(*) FROM menu_items
UNION ALL SELECT 'cafe_settings',COUNT(*) FROM cafe_settings
UNION ALL SELECT 'profiles',     COUNT(*) FROM profiles;
*/
