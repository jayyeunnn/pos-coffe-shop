import { requireOwner } from "@/lib/auth";
import { getCashiers } from "@/lib/data/profiles";
import { getCafeSettings } from "@/lib/data/settings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { CashierManagement } from "@/components/settings/CashierManagement";

export const metadata = { title: "Pengaturan — BrewDesk" };

export default async function SettingsPage() {
  const [user, cashiers, cafeSettings] = await Promise.all([
    requireOwner(),
    getCashiers(),
    getCafeSettings(),
  ]);

  return (
    <div className="space-y-6 p-6">
      <ProfileSettings user={user} cafeSettings={cafeSettings} />
      <CashierManagement cashiers={cashiers} />
    </div>
  );
}
