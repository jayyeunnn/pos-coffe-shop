import { Coffee, Pencil, Trash2 } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuTableProps {
  items: MenuItem[];
  togglingId: string | null;
  deletingId: string | null;
  onEdit: (item: MenuItem) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MenuTable({
  items,
  togglingId,
  deletingId,
  onEdit,
  onToggle,
  onDelete,
}: MenuTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Coffee className="h-10 w-10 text-border" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-text-secondary">Belum ada menu</p>
          <p className="mt-1 text-xs text-text-secondary">Klik "Tambah Menu" untuk menambah item pertama</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {[
              { label: "Foto",     align: "" },
              { label: "Nama",     align: "" },
              { label: "Kategori", align: "" },
              { label: "Harga",    align: "text-right" },
              { label: "Status",   align: "" },
              { label: "Aksi",     align: "text-right" },
            ].map(({ label, align }) => (
              <th
                key={label}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary",
                  align,
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0">
              {/* Foto */}
              <td className="px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-raised">
                  <Coffee className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                </div>
              </td>

              {/* Nama + deskripsi */}
              <td className="px-4 py-3">
                <p className="font-medium text-text-primary">{item.name}</p>
                {item.description && (
                  <p className="mt-0.5 max-w-xs truncate text-xs text-text-secondary">
                    {item.description}
                  </p>
                )}
              </td>

              {/* Kategori */}
              <td className="px-4 py-3 text-text-secondary">
                {item.categories?.name ?? (
                  <span className="text-text-secondary opacity-40">—</span>
                )}
              </td>

              {/* Harga */}
              <td className="px-4 py-3 text-right font-mono text-text-primary">
                {formatRupiah(item.price)}
              </td>

              {/* Toggle tersedia */}
              <td className="px-4 py-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.is_available}
                  aria-label={item.is_available ? "Nonaktifkan" : "Aktifkan"}
                  disabled={togglingId === item.id}
                  onClick={() => onToggle(item.id)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50",
                    item.is_available ? "bg-accent" : "bg-border",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      item.is_available ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </td>

              {/* Aksi */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => onDelete(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-50"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
