import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { APP_NAME } from "@/lib/constants";

export const metadata = { title: `Masuk — ${APP_NAME}` };

export default function LoginPage() {
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-mono text-sm uppercase tracking-widest text-accent">
            ☕ {APP_NAME}
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-text-primary">Selamat datang kembali</h1>
          <p className="mt-1 text-sm text-text-secondary">Masuk untuk mulai melayani.</p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <LoginForm demoEmail={demoEmail} demoPassword={demoPassword} />
        </div>
      </div>
    </main>
  );
}
