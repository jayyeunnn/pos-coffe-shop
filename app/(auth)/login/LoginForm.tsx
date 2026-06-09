"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Memuat…
        </>
      ) : (
        "Masuk"
      )}
    </Button>
  );
}

export function LoginForm({ demoEmail, demoPassword }: { demoEmail: string; demoPassword: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="kamu@brewdesk.app"
          defaultValue={demoEmail}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          defaultValue={demoPassword}
          required
        />
      </div>

      {state.error && (
        <p className="flex items-center gap-2 text-sm text-error" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton />

      <p className="pt-2 text-center text-xs text-text-secondary">
        Demo: owner@brewdesk.app · dinda@brewdesk.app · reza@brewdesk.app
        <br />
        password semua: demo123456
      </p>
    </form>
  );
}
