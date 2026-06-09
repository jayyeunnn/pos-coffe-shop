// ============================================================
// BrewDesk — TypeScript Types
// /types/index.ts
// Source of truth untuk semua entity di aplikasi.
// Generate ulang dari Supabase jika schema berubah:
// npx supabase gen types typescript --local > types/supabase.ts
// ============================================================


// ============================================================
// DATABASE ENTITIES (mirror dari Supabase schema)
// ============================================================

export type UserRole = 'owner' | 'cashier'

export type OrderStatus = 'completed' | 'cancelled'

export type PaymentMethod = 'cash' | 'qris'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number              // integer, Rupiah
  category_id: string | null
  image_url: string | null
  is_available: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  // joined
  categories?: Category | null
}

export interface Order {
  id: string
  order_number: string       // format: BRW-YYYYMMDD-XXX
  cashier_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  subtotal: number
  total: number
  cash_received: number | null
  change_amount: number | null
  notes: string | null
  created_at: string
  // joined
  profiles?: Profile | null
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string | null
  name: string               // snapshot nama saat transaksi
  unit_price: number         // snapshot harga saat transaksi
  quantity: number
  subtotal: number
  notes: string | null
}

export interface CafeSettings {
  id: string
  cafe_name: string
  address: string | null
  phone: string | null
  footer_note: string | null
  updated_at: string
}


// ============================================================
// CART (Zustand state — tidak disimpan ke DB)
// ============================================================

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  subtotal: number           // price * quantity
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}


// ============================================================
// FORM PAYLOADS (untuk API calls / Server Actions)
// ============================================================

export interface CreateOrderPayload {
  items: {
    menuItemId: string
    name: string
    unitPrice: number
    quantity: number
    subtotal: number
    notes?: string
  }[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  cashReceived?: number
  changeAmount?: number
  notes?: string
}

export interface CreateMenuItemPayload {
  name: string
  description?: string
  price: number
  categoryId: string
  imageUrl?: string
  isAvailable: boolean
}

export interface UpdateMenuItemPayload extends Partial<CreateMenuItemPayload> {
  id: string
}

export interface CreateCategoryPayload {
  name: string
  sortOrder?: number
}


// ============================================================
// DASHBOARD / REPORTS
// ============================================================

export interface DailyStats {
  totalRevenue: number
  transactionCount: number
  topItem: {
    name: string
    quantity: number
  } | null
  averagePerTransaction: number
}

export interface WeeklyRevenueData {
  date: string               // format: YYYY-MM-DD
  label: string              // format: 'Sen', 'Sel', dst
  revenue: number
  transactionCount: number
}

export interface RecentOrder {
  id: string
  orderNumber: string
  cashierName: string
  itemCount: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
}


// ============================================================
// UI STATE (local component state, bukan global)
// ============================================================

export type ModalState = 'closed' | 'add' | 'edit' | 'detail' | 'payment' | 'receipt'

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export type SortOrder = 'asc' | 'desc'

export interface OrderFilters {
  dateFrom?: string          // format: YYYY-MM-DD
  dateTo?: string
  cashierId?: string
  status?: OrderStatus
  paymentMethod?: PaymentMethod
}

export interface MenuFilters {
  categoryId?: string
  search?: string
  showUnavailable?: boolean
}


// ============================================================
// SUPABASE RESPONSE WRAPPER
// ============================================================

export interface SupabaseError {
  message: string
  code?: string
  details?: string
}

export type DbResult<T> = {
  data: T
  error: null
} | {
  data: null
  error: SupabaseError
}


// ============================================================
// RECEIPT (untuk PrintModal)
// ============================================================

export interface ReceiptData {
  orderNumber: string
  cafeName: string
  cafeAddress: string | null
  cashierName: string
  items: {
    name: string
    quantity: number
    unitPrice: number
    subtotal: number
  }[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  cashReceived: number | null
  changeAmount: number | null
  footerNote: string | null
  createdAt: string
}
