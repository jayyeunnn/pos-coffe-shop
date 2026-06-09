"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="icon" aria-label="Keluar" title="Keluar">
        <LogOut className="h-5 w-5" />
      </Button>
    </form>
  );
}
