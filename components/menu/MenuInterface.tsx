"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { MenuTable } from "./MenuTable";
import { MenuFormModal } from "./MenuFormModal";
import { CategorySection } from "./CategorySection";
import {
  toggleAvailableAction,
  softDeleteMenuItemAction,
} from "@/app/(dashboard)/menu/actions";
import type { MenuItem, Category } from "@/types";

interface MenuInterfaceProps {
  items: MenuItem[];
  categories: Category[];
}

export function MenuInterface({ items, categories }: MenuInterfaceProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterCatId, setFilterCatId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = items;
    if (filterCatId) result = result.filter((m) => m.category_id === filterCatId);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    return result;
  }, [items, filterCatId, search]);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await toggleAvailableAction(id);
      router.refresh();
    } catch {
      toast.error("Gagal mengubah status menu");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await softDeleteMenuItemAction(id);
      toast.success("Menu dihapus");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus menu");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setModalMode("edit");
  };

  const isFiltered = !!search.trim() || !!filterCatId;

  return (
    <div className="space-y-5 p-6">
      {/* Filter bar + CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-surface-raised pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Category filter */}
        <select
          value={filterCatId ?? ""}
          onChange={(e) => setFilterCatId(e.target.value || null)}
          className="h-10 rounded-md border border-border bg-surface-raised px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* CTA */}
        <button
          type="button"
          onClick={() => { setEditingItem(null); setModalMode("add"); }}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-background transition-[transform,background-color] duration-[150ms] ease-out hover:bg-accent-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Menu
        </button>
      </div>

      {/* Filter result count */}
      {isFiltered && (
        <p className="text-xs text-text-secondary">
          {filtered.length} dari {items.length} item ditampilkan
        </p>
      )}

      {/* Menu table — flush, no extra padding */}
      <div className="rounded-lg border border-border bg-surface">
        <MenuTable
          items={filtered}
          togglingId={togglingId}
          deletingId={deletingId}
          onEdit={openEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* Category section */}
      <CategorySection
        categories={categories}
        onRefresh={() => router.refresh()}
      />

      {/* Form modal */}
      <MenuFormModal
        open={modalMode !== null}
        mode={modalMode ?? "add"}
        item={editingItem}
        categories={categories}
        onClose={() => { setModalMode(null); setEditingItem(null); }}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
