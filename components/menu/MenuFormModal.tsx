"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMenuItemAction, updateMenuItemAction } from "@/app/(dashboard)/menu/actions";
import type { MenuItem, Category } from "@/types";

interface MenuFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  item?: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export function MenuFormModal({
  open,
  mode,
  item,
  categories,
  onClose,
  onSuccess,
}: MenuFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  // Populate form saat edit
  useEffect(() => {
    if (mode === "edit" && item) {
      setName(item.name);
      setDescription(item.description ?? "");
      setPrice(String(item.price));
      setCategoryId(item.category_id ?? "");
      setIsAvailable(item.is_available);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId(categories[0]?.id ?? "");
      setIsAvailable(true);
    }
  }, [mode, item, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Math.round(Number(price));
    if (!name.trim()) return toast.error("Nama menu wajib diisi");
    if (!parsedPrice || parsedPrice <= 0) return toast.error("Harga tidak valid");
    if (!categoryId) return toast.error("Pilih kategori");

    setLoading(true);
    try {
      if (mode === "add") {
        await createMenuItemAction({
          name: name.trim(),
          description: description.trim() || undefined,
          price: parsedPrice,
          categoryId,
          isAvailable,
        });
        toast.success("Menu berhasil ditambahkan");
      } else if (item) {
        await updateMenuItemAction({
          id: item.id,
          name: name.trim(),
          description: description.trim() || undefined,
          price: parsedPrice,
          categoryId,
          isAvailable,
        });
        toast.success("Menu berhasil diperbarui");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Gagal menyimpan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Menu" : "Edit Menu"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="space-y-1.5">
            <Label htmlFor="menu-name">Nama Menu</Label>
            <Input
              id="menu-name"
              placeholder="Americano"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="menu-desc">
              Deskripsi{" "}
              <span className="text-text-secondary">(opsional)</span>
            </Label>
            <textarea
              id="menu-desc"
              placeholder="Kopi hitam tanpa susu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="flex w-full rounded-sm border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none"
            />
          </div>

          {/* Harga + Kategori side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="menu-price">Harga (Rp)</Label>
              <Input
                id="menu-price"
                type="number"
                inputMode="numeric"
                min="0"
                step="500"
                placeholder="28000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="menu-category">Kategori</Label>
              <select
                id="menu-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Pilih...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggle Tersedia */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-raised px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Tersedia</p>
              <p className="text-xs text-text-secondary">
                Tampil di POS untuk kasir
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAvailable ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
