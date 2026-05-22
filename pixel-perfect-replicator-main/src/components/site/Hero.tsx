import { Wallet, Zap, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-glow-radial pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center relative">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] shadow-[0_0_8px_var(--mint)]" />
            <span className="font-mono-label text-muted-foreground">Powered by Universal Gas Framework</span>
          </div>

          <h1 className="mt-7 font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
            Zero ETH. <span className="text-gradient-violet">Real onchain action.</span>
          </h1>

          <p className="mt-6 text-muted-foreground text-base max-w-md leading-relaxed">
            A beginner-friendly dApp on Base Sepolia powered by the Universal Gas Framework. Skip the ETH funding step — sign in, act on-chain, and let UGF settle your gas in Mock USD.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] px-5 py-3 text-sm font-medium text-white shadow-[0_0_40px_oklch(0.7_0.22_295_/_0.45)] hover:opacity-90 transition">
              <Zap className="w-4 h-4" /> Launch App
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 text-sm font-medium hover:bg-card transition">
              View Demo <ArrowRight className="w-4 h-4" />
            </button>
            <button className="rounded-full border border-border bg-card/30 px-5 py-3 text-sm font-medium hover:bg-card transition">
              GitHub
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-border/60 max-w-md">
            <Stat label="Gas Cost" value="0 ETH" accent />
            <Stat label="Network" value="Base Sepolia" />
            <Stat label="Settlement" value="Mock USD" />
          </div>
        </div>

        {/* Right card */}
        <div className="relative">
          <div className="absolute -inset-8 bg-glow-radial pointer-events-none" />
          <div className="card-glow rounded-2xl p-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-secondary grid place-items-center border border-border">
                  <Wallet className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-mono-label text-muted-foreground">Wallet</div>
                  <div className="font-mono text-sm">0x5f4a…8b21</div>
                </div>
              </div>
              <span className="rounded-full bg-[var(--mint)]/15 text-[var(--mint)] text-xs px-2.5 py-1 border border-[var(--mint)]/30">Live</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="font-mono-label text-muted-foreground">ETH Balance</div>
                <div className="mt-2 text-2xl font-display font-semibold">0.00 <span className="text-xs text-muted-foreground font-sans">ETH</span></div>
                <div className="mt-2 text-xs text-muted-foreground">Not enough ETH for gas. Gaslessio continues anyway.</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="font-mono-label text-muted-foreground">Mock USD</div>
                <div className="mt-2 text-2xl font-display font-semibold">$1,250.00</div>
                <div className="mt-2 text-xs text-muted-foreground">Spend, mint, or claim without funding gas.</div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-label text-muted-foreground">Transaction Pipeline</span>
                <span className="text-[var(--mint)] text-xs">Sponsored</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-2 h-24">
                {[60, 85, 55, 100, 70, 45, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-md"
                    style={{
                      height: `${h}%`,
                      background: i === 3
                        ? "linear-gradient(180deg, oklch(0.85 0.2 340), oklch(0.7 0.22 320))"
                        : "linear-gradient(180deg, oklch(0.6 0.22 295), oklch(0.4 0.18 290))",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono-label text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display font-semibold ${accent ? "text-[var(--mint)]" : ""}`}>{value}</div>
    </div>
  );
}
