import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "3 klik", label: "proses 1 transaksi" },
  { value: "< 1 dtk", label: "cari menu apapun" },
  { value: "Real-time", label: "laporan harian" },
];

export function Hero() {
  return (
    <section id="landing-hero" className="flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
      {/* Eyebrow badge */}
      <span className="mb-6 inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-text-secondary">
        POS untuk coffee shop Indonesia
      </span>

      {/* Display heading — Fraunces serif, hanya di landing hero */}
      <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-7xl">
        Kasir yang akhirnya secantik kopi kamu.
      </h1>

      <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary md:text-lg">
        POS minimalist untuk coffee shop. Gratis, cepat, dan tidak butuh
        training.
      </p>

      <Link
        href="/login"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-6 font-medium text-background transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Coba Demo Sekarang
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      {/* Stats strip */}
      <div className="mt-14 grid w-full max-w-2xl grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface">
        {STATS.map((stat) => (
          <div key={stat.label} className="py-5 text-center">
            <p className="font-serif text-2xl font-bold text-text-primary">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
