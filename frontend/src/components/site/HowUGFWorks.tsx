export function HowUGFWorks() {
  return (
    <section id="how" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono-label text-[var(--violet)]">How UGF works</div>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl leading-tight">
            Quote. Settle.<br />Execute. Confirm.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            UGF is an execution layer for remote transactions. It lets users act on any chain without holding that chain's gas token. The user pays in Mock USD — UGF takes it from quote to confirmed transaction on Base Sepolia.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Step n="01 / Quote" title="Price the action in Mock USD" body="The app asks UGF what the on-chain action will cost. The user sees one number in Mock USD — no gwei, no ETH math." />
            <Step n="02 / Settle" title="User pays in Mock USD" body="The user approves the Mock USD payment in one signature. No ETH balance required, no bridge, no faucet." />
          </div>
          <div className="card-glow rounded-2xl p-6 border-l-2 border-[var(--violet)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="font-mono-label text-[var(--violet)]">03 / Execute</div>
                <h3 className="mt-2 font-display font-semibold text-xl">UGF runs the transaction on Base Sepolia</h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  UGF executes the actual on-chain call — mint, donate, send, claim — and pays the native gas on the user's behalf. No paymasters, no bundlers, no ERC-4337 setup needed.
                </p>
              </div>
              <div className="w-44 shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-[var(--mint)]">Confirmed</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-[var(--mint)] via-[var(--violet)] to-[var(--pink)]" />
                </div>
              </div>
            </div>
          </div>
          <div className="card-glow rounded-2xl p-6">
            <div className="font-mono-label text-[var(--violet)]">04 / Confirm</div>
            <h3 className="mt-2 font-display font-semibold text-xl">Receipt + BaseScan link, in plain English</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              The user sees a clear success state — badge minted, donation sent, token transferred — with the on-chain hash. Web3 UX that finally feels like a normal product.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card-glow rounded-xl p-5">
      <div className="font-mono-label text-muted-foreground">{n}</div>
      <h4 className="mt-2 font-display font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
