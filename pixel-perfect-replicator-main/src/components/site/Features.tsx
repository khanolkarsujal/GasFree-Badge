import { Sparkles } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono-label text-[var(--violet)]">What you get</div>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl leading-tight">
            Real onchain actions.<br />Paid in Mock USD.<br />Zero ETH in the wallet.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            Most dApps break the moment a new user lands without ETH. Gaslessio uses the Universal Gas Framework so users mint, donate, send, and claim on Base Sepolia while paying gas in Mock USD — no faucet hunt, no bridge, no ERC-4337 setup.
          </p>
        </div>

        <div className="space-y-4">
          <div className="card-glow rounded-2xl p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="w-9 h-9 rounded-lg bg-secondary grid place-items-center border border-border mb-4">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="font-display font-semibold text-xl">Pay gas in Mock USD, settled by UGF.</h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  Before the user signs, they see exactly what the action costs in Mock USD. UGF quotes the fee, settles it, and executes the transaction on Base Sepolia. The user never touches ETH.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-muted-foreground">User<br/>pays</div>
                <div className="mt-1 text-3xl font-display font-bold text-[var(--mint)]">0<br/>ETH</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <SmallCard title="Built on UGF" body="No paymasters, no bundlers, no ERC-4337 plumbing. Just the UGF Testnet SDK doing quote → settle → execute → confirm." />
            <SmallCard title="Something real" body="Mint an NFT badge, send a donation, or claim a credential. Every demo is a working on-chain action, not a mockup." />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { step: "01", label: "Quote" },
              { step: "02", label: "Settle" },
              { step: "03", label: "Execute" },
              { step: "04", label: "Confirm" },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="font-mono-label text-muted-foreground">Step {s.step}</div>
                <div className="mt-2 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-glow rounded-xl p-5">
      <h4 className="font-display font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
