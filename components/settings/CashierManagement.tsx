"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, Users } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import {
  createCashierAction,
  toggleCashierActiveAction,
} from "@/app/(dashboard)/settings/actions";
import type { Profile } from "@/types";

interface CashierManagementProps {
  cashiers: Profile[];
}

export function CashierManagement({ cashiers }: CashierManagementProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await createCashierAction(newName);
      toast.success(`Kasir "${newName.trim()}" ditambahkan`);
      setNewName("");
      setAdding(false);
      router.refresh();
    } catch {
      toast.error("Gagal menambah kasir");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      await toggleCashierActiveAction(id);
      toast.success(currentActive ? "Kasir dinonaktifkan" : "Kasir diaktifkan");
      router.refresh();
    } catch {
      toast.error("Gagal mengubah status kasir");
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = cashiers.filter((c) => c.is_active).length;

  return (
    <div className="rounded-lg border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Manajemen Kasir
          </h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            {activeCount} aktif dari {cashiers.length} kasir
          </p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Tambah Kasir
          </button>
        )}
      </div>

      {/* Inline add form */}
      {adding && (
        <div className="border-t border-border px-5 py-4">
          <p className="mb-3 text-xs text-text-secondary">
            Di mode demo, kasir baru ditampilkan namun belum bisa login.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nama kasir..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
              className="h-10 flex-1 rounded-md border border-border bg-surface-raised px-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              disabled={loading || !newName.trim()}
              onClick={handleAdd}
              className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-background transition-colors hover:bg-accent-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Simpan kasir"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setNewName(""); }}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Batal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Kasir list */}
      <div className={cn("overflow-x-auto", adding ? "" : "border-t border-border")}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {[
                { label: "Nama",      align: "" },
                { label: "Bergabung", align: "" },
                { label: "Status",    align: "text-right" },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  className={cn(
                    "px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary",
                    align,
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cashiers.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <Users className="h-8 w-8 text-border" aria-hidden="true" />
                    <p className="text-sm text-text-secondary">Belum ada kasir terdaftar</p>
                  </div>
                </td>
              </tr>
            ) : (
              cashiers.map((cashier) => (
                <tr key={cashier.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-text-primary">
                    {cashier.full_name}
                  </td>
                  <td className="px-5 py-3 text-xs text-text-secondary">
                    {formatDate(cashier.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={cashier.is_active}
                      aria-label={cashier.is_active ? "Nonaktifkan kasir" : "Aktifkan kasir"}
                      disabled={togglingId === cashier.id}
                      onClick={() => handleToggle(cashier.id, cashier.is_active)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50",
                        cashier.is_active ? "bg-accent" : "bg-border",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                          cashier.is_active ? "translate-x-6" : "translate-x-1",
                        )}
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
