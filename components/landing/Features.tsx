import { Zap, BarChart3, Coffee } from "lucide-react";

export function Features() {
  return (
    <section id="landing-features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Left-aligned — specific, not centered, not aphoristic */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
            Dirancang untuk shift yang sibuk.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Fitur yang tepat untuk operasional harian F&amp;B kecil-menengah.
          </p>
        </div>

        {/* Primary feature — accented callout, not a card */}
        <div className="mt-12 flex flex-col gap-6 rounded-xl bg-accent/10 px-8 py-10 md:flex-row md:items-center md:gap-12">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-accent/20">
            <Zap className="h-7 w-7 text-accent" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">
              3 klik, order selesai.
            </h3>
            <p className="mt-2 max-w-lg text-base leading-relaxed text-text-secondary">
              Pilih menu, input jumlah, konfirmasi. Antrian tidak menumpuk dan
              pelanggan tidak menunggu. Dirancang untuk kecepatan di jam sibuk.
            </p>
          </div>
        </div>

        {/* Two secondary features — border-t, no card containers */}
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="border-t border-border pt-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised">
              <BarChart3 className="h-5 w-5 text-text-secondary" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              Dashboard real-time.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Revenue hari ini, item terlaris, dan jumlah transaksi tersedia
              dalam satu layar.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised">
              <Coffee className="h-5 w-5 text-text-secondary" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              Didesain untuk barista.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Kasir baru bisa langsung pakai dalam 5 menit. Tidak butuh
              training atau buku panduan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
