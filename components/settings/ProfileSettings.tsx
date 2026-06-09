"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateProfileNameAction,
  updateCafeSettingsAction,
} from "@/app/(dashboard)/settings/actions";
import type { Profile, CafeSettings } from "@/types";

interface ProfileSettingsProps {
  user: Profile;
  cafeSettings: CafeSettings;
}

export function ProfileSettings({ user, cafeSettings }: ProfileSettingsProps) {
  const router = useRouter();

  // Profil state
  const [fullName, setFullName] = useState(user.full_name);
  const [savingProfile, setSavingProfile] = useState(false);

  // Cafe state
  const [cafeName, setCafeName] = useState(cafeSettings.cafe_name);
  const [address, setAddress] = useState(cafeSettings.address ?? "");
  const [phone, setPhone] = useState(cafeSettings.phone ?? "");
  const [footerNote, setFooterNote] = useState(cafeSettings.footer_note ?? "");
  const [savingCafe, setSavingCafe] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Nama tidak boleh kosong");
    setSavingProfile(true);
    try {
      await updateProfileNameAction(fullName);
      toast.success("Profil diperbarui");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveCafe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafeName.trim()) return toast.error("Nama cafe tidak boleh kosong");
    setSavingCafe(true);
    try {
      await updateCafeSettingsAction({
        cafe_name: cafeName.trim(),
        address: address.trim() || null,
        phone: phone.trim() || null,
        footer_note: footerNote.trim() || null,
      });
      toast.success("Info cafe diperbarui");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan info cafe");
    } finally {
      setSavingCafe(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Profil Saya</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full-name">Nama Lengkap</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama kamu"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <div className="flex h-10 items-center rounded-md border border-border bg-surface-raised px-3 text-sm text-text-secondary">
              {user.role === "owner" ? "Owner" : "Kasir"}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={savingProfile} size="sm">
              {savingProfile ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </div>
        </form>
      </div>

      {/* Info Cafe */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Info Cafe</h2>
        <form onSubmit={handleSaveCafe} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cafe-name">Nama Cafe</Label>
            <Input
              id="cafe-name"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              placeholder="Nama cafe kamu"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cafe-address">
                Alamat <span className="text-text-secondary">(opsional)</span>
              </Label>
              <Input
                id="cafe-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Kopi No. 1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cafe-phone">
                Telepon <span className="text-text-secondary">(opsional)</span>
              </Label>
              <Input
                id="cafe-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xx-xxxx-xxxx"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footer-note">
              Pesan di Struk <span className="text-text-secondary">(opsional)</span>
            </Label>
            <Input
              id="footer-note"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              placeholder="Terima kasih sudah berkunjung!"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={savingCafe} size="sm">
              {savingCafe ? "Menyimpan..." : "Simpan Info Cafe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
