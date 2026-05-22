import { Wallet, CreditCard, Cpu, Zap, CheckCircle2 } from "lucide-react";

export function TransactionFlow() {
  return (
    <section id="flow" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
        {/* Left: copy + step cards (matches Features / HowItWorks layout) */}
        <div>
          <div className="font-mono-label text-[var(--violet)]">Transaction Flow</div>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl leading-tight">
            How every gasless<br />transaction works.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            Under the hood, UGF orchestrates a seamless 4-step flow: authenticate, quote, settle in Mock USD, and execute on-chain — all with zero ETH in the user's wallet.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <MiniStep n="01" title="Authenticate" body="EIP-191 wallet signature creates a UGF session." />
            <MiniStep n="02" title="Quote" body="UGF oracle prices the gas fee in Mock USD (TYI)." />
            <MiniStep n="03" title="Settle" body="ERC-3009 signature authorizes Mock USD deduction." />
            <MiniStep n="04" title="Execute" body="UGF sponsors the ETH gas and sends your transaction." />
          </div>
        </div>

        {/* Right: pipeline card */}
        <div className="card-glow rounded-2xl p-6 relative">
          <div className="absolute -inset-8 bg-glow-radial pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono-label text-muted-foreground">Pipeline</div>
                <h3 className="mt-1 font-display font-semibold text-xl">UGF Transaction Pipeline</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--mint)]/30 bg-[var(--mint)]/10 text-[var(--mint)] font-mono-label">
                Live
              </span>
            </div>

            <div className="mt-6 relative">
              <div className="absolute left-[27px] top-10 bottom-10 w-px bg-gradient-to-b from-[var(--violet)]/60 via-[var(--violet)]/20 to-[var(--mint)]/60" />

              <PipeRow
                icon={<Wallet className="w-5 h-5" />}
                title="User Wallet"
                tag="Any EVM Wallet"
                sub="ETH Balance: 0"
              />
              <PipeRow
                icon={<CreditCard className="w-5 h-5" />}
                title="Mock USD"
                tag="Gas Settlement"
                sub="TYI Stablecoin"
              />
              <PipeRow
                icon={<Cpu className="w-5 h-5" />}
                title="UGF Layer"
                tag="EIP-191 · ERC-3009"
                sub="Universal Gas Framework"
              />
              <PipeRow
                icon={<Zap className="w-5 h-5" />}
                title="Base Sepolia"
                tag="Fast · Secure"
                sub="L2 Blockchain"
              />
              <PipeRow
                icon={<CheckCircle2 className="w-5 h-5" />}
                title="Transaction Success"
                tag="Confirmed On-Chain"
                sub="Zero ETH spent"
                success
              />
            </div>

            <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-3 gap-3">
              <Stat value="0.00" label="ETH Used" tone="mint" />
              <Stat value="~2s" label="Time" tone="violet" />
              <Stat value="Base L2" label="Network" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="font-mono-label text-[var(--violet)]">Step {n}</div>
      <div className="mt-2 text-sm font-display font-semibold">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function PipeRow({
  icon, title, tag, sub, success,
}: { icon: React.ReactNode; title: string; tag: string; sub: string; success?: boolean }) {
  const accent = success ? "var(--mint)" : "var(--violet)";
  return (
    <div className="relative flex items-center gap-4 py-2.5">
      <div
        className="relative shrink-0 w-14 h-14 rounded-xl grid place-items-center border"
        style={{
          background: `color-mix(in oklab, ${accent} 10%, transparent)`,
          borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
          color: accent,
          boxShadow: `0 0 24px -10px ${accent}`,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-display font-semibold ${success ? "text-[var(--mint)]" : ""}`}>
            {title}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full border font-mono-label"
            style={{
              color: accent,
              background: `color-mix(in oklab, ${accent} 12%, transparent)`,
              borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
            }}
          >
            {tag}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
      />
    </div>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: "mint" | "violet" }) {
  const color =
    tone === "mint" ? "text-[var(--mint)]" : tone === "violet" ? "text-[var(--violet)]" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3 text-center">
      <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
      <div className="font-mono-label text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
