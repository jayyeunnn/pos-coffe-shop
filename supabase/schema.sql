-- ============================================================
-- BrewDesk — Supabase Schema
-- Jalankan file ini di Supabase SQL Editor (sekali saja)
-- Urutan: tables → triggers → RLS → policies
-- ============================================================


-- ============================================================
-- 1. TABLES
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('owner', 'cashier')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  price        INT NOT NULL CHECK (price > 0),  -- Rupiah, integer
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url    TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted   BOOLEAN NOT NULL DEFAULT FALSE,   -- soft delete
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT NOT NULL UNIQUE,          -- format: BRW-YYYYMMDD-XXX
  cashier_id      UUID NOT NULL REFERENCES profiles(id),
  status          TEXT NOT NULL DEFAULT 'completed'
                    CHECK (status IN ('completed', 'cancelled')),
  payment_method  TEXT NOT NULL
                    CHECK (payment_method IN ('cash', 'qris')),
  subtotal        INT NOT NULL CHECK (subtotal >= 0),
  total           INT NOT NULL CHECK (total >= 0),
  cash_received   INT CHECK (cash_received >= 0),  -- NULL jika QRIS
  change_amount   INT CHECK (change_amount >= 0),  -- NULL jika QRIS
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items (snapshot nama + harga saat transaksi)
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id  UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,        -- snapshot: jangan ubah meski menu diedit
  unit_price    INT NOT NULL,         -- snapshot: harga saat transaksi
  quantity      INT NOT NULL CHECK (quantity > 0),
  subtotal      INT NOT NULL,         -- unit_price * quantity
  notes         TEXT
);

-- Cafe settings (untuk tampil di struk)
CREATE TABLE IF NOT EXISTS cafe_settings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_name    TEXT NOT NULL DEFAULT 'My Cafe',
  address      TEXT,
  phone        TEXT,
  footer_note  TEXT DEFAULT 'Terima kasih sudah berkunjung!',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 2. INDEXES (performa query)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_menu_items_category    ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available   ON menu_items(is_available, is_deleted);
CREATE INDEX IF NOT EXISTS idx_orders_cashier         ON orders(cashier_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at      ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order      ON order_items(order_id);


-- ============================================================
-- 3. TRIGGERS
-- ============================================================

-- Auto-update updated_at di menu_items
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cafe_settings_updated_at
  BEFORE UPDATE ON cafe_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile setelah signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'cashier')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- 4. HELPER FUNCTION — get current user role
-- ============================================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS semua table
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_settings  ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PROFILES policies
-- ============================================================

-- User bisa READ profil sendiri
CREATE POLICY "profiles: read own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Owner bisa READ semua profil (untuk kelola kasir)
CREATE POLICY "profiles: owner read all"
  ON profiles FOR SELECT
  USING (get_my_role() = 'owner');

-- User bisa UPDATE profil sendiri
CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Owner bisa INSERT profil baru (untuk tambah kasir)
CREATE POLICY "profiles: owner insert"
  ON profiles FOR INSERT
  WITH CHECK (get_my_role() = 'owner');

-- Owner bisa UPDATE profil kasir (untuk nonaktifkan)
CREATE POLICY "profiles: owner update others"
  ON profiles FOR UPDATE
  USING (get_my_role() = 'owner');


-- ============================================================
-- CATEGORIES policies
-- ============================================================

-- Semua authenticated user bisa READ kategori
CREATE POLICY "categories: authenticated read"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Hanya owner yang bisa INSERT / UPDATE / DELETE kategori
CREATE POLICY "categories: owner write"
  ON categories FOR INSERT
  WITH CHECK (get_my_role() = 'owner');

CREATE POLICY "categories: owner update"
  ON categories FOR UPDATE
  USING (get_my_role() = 'owner');

CREATE POLICY "categories: owner delete"
  ON categories FOR DELETE
  USING (get_my_role() = 'owner');


-- ============================================================
-- MENU_ITEMS policies
-- ============================================================

-- Semua authenticated user bisa READ menu (termasuk yang is_deleted untuk order history)
CREATE POLICY "menu_items: authenticated read"
  ON menu_items FOR SELECT
  TO authenticated
  USING (true);

-- Hanya owner yang bisa INSERT / UPDATE menu items
CREATE POLICY "menu_items: owner insert"
  ON menu_items FOR INSERT
  WITH CHECK (get_my_role() = 'owner');

CREATE POLICY "menu_items: owner update"
  ON menu_items FOR UPDATE
  USING (get_my_role() = 'owner');

-- DELETE diblokir total — gunakan soft delete (is_deleted = true)
-- Tidak ada DELETE policy → tidak ada yang bisa hard delete


-- ============================================================
-- ORDERS policies
-- ============================================================

-- Kasir hanya bisa READ order milik sendiri
-- Owner bisa READ semua order
CREATE POLICY "orders: read own or owner"
  ON orders FOR SELECT
  USING (
    cashier_id = auth.uid()          -- kasir lihat milik sendiri
    OR get_my_role() = 'owner'       -- owner lihat semua
  );

-- Kasir dan owner bisa INSERT order baru
CREATE POLICY "orders: insert authenticated"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (cashier_id = auth.uid());

-- Owner bisa UPDATE status order (cancel)
CREATE POLICY "orders: owner update"
  ON orders FOR UPDATE
  USING (get_my_role() = 'owner');

-- Tidak ada DELETE policy → orders tidak bisa dihapus


-- ============================================================
-- ORDER_ITEMS policies
-- ============================================================

-- READ: ikuti policy orders (via join)
CREATE POLICY "order_items: read via order"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND (o.cashier_id = auth.uid() OR get_my_role() = 'owner')
    )
  );

-- INSERT: hanya saat buat order (cashier_id = auth.uid())
CREATE POLICY "order_items: insert authenticated"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.cashier_id = auth.uid()
    )
  );


-- ============================================================
-- CAFE_SETTINGS policies
-- ============================================================

-- Semua authenticated user bisa READ (untuk tampil di struk)
CREATE POLICY "cafe_settings: authenticated read"
  ON cafe_settings FOR SELECT
  TO authenticated
  USING (true);

-- Hanya owner yang bisa UPDATE cafe settings
CREATE POLICY "cafe_settings: owner update"
  ON cafe_settings FOR UPDATE
  USING (get_my_role() = 'owner');

-- INSERT hanya sekali (di seed.sql)
CREATE POLICY "cafe_settings: owner insert"
  ON cafe_settings FOR INSERT
  WITH CHECK (get_my_role() = 'owner');


-- ============================================================
-- SELESAI
-- Jalankan seed.sql setelah schema ini berhasil.
-- ============================================================
