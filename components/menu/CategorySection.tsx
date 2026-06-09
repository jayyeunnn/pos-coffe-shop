"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/(dashboard)/menu/actions";
import type { Category } from "@/types";

interface CategorySectionProps {
  categories: Category[];
  onRefresh: () => void;
}

export function CategorySection({ categories, onRefresh }: CategorySectionProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await createCategoryAction(newName);
      toast.success("Kategori ditambahkan");
      setNewName("");
      setAdding(false);
      onRefresh();
    } catch {
      toast.error("Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    setLoading(true);
    try {
      await updateCategoryAction(id, editingName);
      toast.success("Kategori diperbarui");
      setEditingId(null);
      onRefresh();
    } catch {
      toast.error("Gagal memperbarui kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setLoading(true);
    try {
      await deleteCategoryAction(id);
      toast.success(`Kategori "${name}" dihapus`);
      onRefresh();
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Kategori</h2>
          <p className="text-xs text-text-secondary">{categories.length} kategori</p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-surface-raised px-3 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Tambah
          </button>
        )}
      </div>

      {/* Form tambah */}
      {adding && (
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="Nama kategori..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
            className="h-9 flex-1 rounded-sm border border-border bg-surface-raised px-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            disabled={loading || !newName.trim()}
            onClick={handleAdd}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
            aria-label="Simpan kategori"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setNewName(""); }}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-raised text-text-secondary transition-colors hover:text-text-primary"
            aria-label="Batal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Category list */}
      <div className="space-y-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised"
          >
            {editingId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  autoFocus
                  className="h-7 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleUpdate(cat.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-background hover:bg-accent-hover disabled:opacity-50"
                  aria-label="Simpan"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-raised text-text-secondary hover:text-text-primary"
                  aria-label="Batal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-text-primary">{cat.name}</span>
                <button
                  type="button"
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary opacity-0 transition-all hover:bg-surface hover:text-text-primary group-hover:opacity-100 [.hover\\:bg-surface-raised:hover_&]:opacity-100"
                  aria-label={`Edit ${cat.name}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
                  aria-label={`Hapus ${cat.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && !adding && (
          <p className="py-4 text-center text-xs text-text-secondary">
            Belum ada kategori
          </p>
        )}
      </div>
    </div>
  );
}
