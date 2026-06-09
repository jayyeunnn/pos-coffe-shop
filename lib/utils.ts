import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn/ui className merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer Rupiah ke string tampilan.
 * formatRupiah(28000) -> "Rp 28.000"
 * Harga SELALU integer (tanpa desimal).
 */
export function formatRupiah(amount: number): string {
  if (!Number.isFinite(amount)) return "Rp 0";
  const rounded = Math.round(amount);
  return "Rp " + rounded.toLocaleString("id-ID");
}

/**
 * Generate order number: BRW-YYYYMMDD-XXX
 * @param sequence urutan order hari itu (1-based)
 * @param date     default: sekarang
 * Contoh: generateOrderNumber(42) -> "BRW-20260609-042"
 */
export function generateOrderNumber(sequence: number, date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const seq = String(sequence).padStart(3, "0");
  return `BRW-${yyyy}${mm}${dd}-${seq}`;
}

/** Format ISO timestamp ke jam lokal: "14:32" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format ISO timestamp ke tanggal lokal: "9 Jun 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
