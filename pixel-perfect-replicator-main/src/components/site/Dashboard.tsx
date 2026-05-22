export function Dashboard() {
  return (
    <section id="dashboard" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="card-glow rounded-2xl p-6 relative">
          <div className="absolute -inset-8 bg-glow-radial pointer-events-none" />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="font-mono-label text-muted-foreground">Dashboard</div>
              <h3 className="mt-1 font-display font-semibold text-xl">Gasless transaction room</h3>
            </div>
            <button className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs">Connect Wallet</button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 relative">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="font-mono-label text-muted-foreground">Wallet State</div>
              <Row label="ETH balance" value="0.00" />
              <Row label="Mock USD" value="$1,250" violet />
              <div className="mt-3 rounded-md bg-[var(--mint)]/10 border border-[var(--mint)]/25 text-[var(--mint)] text-xs px-3 py-2 flex justify-between">
                <span>Gas status</span><span>Sponsored</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="font-mono-label text-muted-foreground">Transaction Steps</div>
              <StepLine n={1} title="Choose reward" body="Select Explorer, Builder, or Pioneer." />
              <StepLine n={2} title="Review gas message" body="The UI confirms ETH is not required for this action." />
              <StepLine n={3} title="Sign and receive" body="A confirmed receipt appears with a BaseScan link." mint />
            </div>
          </div>
        </div>

        <div>
          <div className="font-mono-label text-[var(--violet)]">Why this matters</div>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl leading-tight">
            The thing that normally breaks — gas — just works.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            A new user lands, connects a wallet with 0 ETH, picks an action, pays in Mock USD, and gets a confirmed on-chain transaction. No "insufficient funds for gas." No bridge tutorial. No giving up halfway.
          </p>
          <div className="mt-6 card-glow rounded-xl p-5 max-w-md">
            <h4 className="font-display font-semibold">Built with the UGF Testnet SDK</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Integrated via React-UGF on Base Sepolia. Every state — quoting, settling, executing, confirmed, retryable — is mapped to a clear screen the user can understand.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, violet }: { label: string; value: string; violet?: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <span className={`text-sm ${violet ? "text-[var(--violet)]" : "text-muted-foreground"}`}>{label}</span>
      <span className="font-display font-semibold">{value}</span>
    </div>
  );
}

function StepLine({ n, title, body, mint }: { n: number; title: string; body: string; mint?: boolean }) {
  return (
    <div className="mt-3 flex gap-3">
      <span className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-medium ${mint ? "bg-[var(--mint)] text-background" : "bg-gradient-to-br from-[var(--violet)] to-[var(--pink)] text-white"}`}>{n}</span>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
