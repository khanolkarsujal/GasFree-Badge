import { useState } from "react";
import { Award, Settings, ArrowUp } from "lucide-react";

const tabs = ["Minting a credential", "Payments checkout", "Wallet in a faucet"];

const badges = [
  { kind: "Common Badge", name: "Explorer", desc: "Your first on-chain credential. Zero ETH, just connect and claim.", fee: "0.15 Mock USD", Icon: Award },
  { kind: "Rare Badge", name: "Builder", desc: "For devs and creators actively building on Base. Proof of craft.", fee: "0.35 Mock USD", Icon: Settings },
  { kind: "Epic Badge", name: "Pioneer", desc: "Early adopters who prove gasless UX actually works.", fee: "0.15 Mock USD", Icon: ArrowUp },
];

export function Playground() {
  const [active, setActive] = useState(0);
  return (
    <section id="rewards" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="font-mono-label text-[var(--violet)]">Try it on Base Sepolia</div>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl">Real actions. Mock USD gas.</h2>
          <p className="mt-5 text-muted-foreground">
            Three things users normally can't do without ETH — minting a credential, paying at checkout, claiming from a faucet flow. With UGF, every one of them works from a wallet with $0 in ETH.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-3xl rounded-full border border-border bg-card/40 p-1.5 flex">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm transition ${
                active === i
                  ? "bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] text-white shadow-[0_0_30px_oklch(0.7_0.22_295_/_0.5)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-[var(--mint)]/10 border border-[var(--mint)]/30 text-[var(--mint)] text-xs px-3 py-1">$0 ETH required</span>
              <h3 className="mt-3 font-display font-bold text-2xl">Demo: Mint an NFT badge on Base Sepolia</h3>
              <p className="mt-1 text-sm text-muted-foreground">A real ERC-721 mint to your address. You pay the fee in Mock USD; UGF executes the on-chain transaction.</p>
            </div>
            <button className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm">Connect wallet to claim</button>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {badges.map((b) => (
              <div key={b.name} className="card-glow rounded-2xl p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="font-mono-label text-muted-foreground">{b.kind}</div>
                  <span className="w-9 h-9 rounded-lg bg-secondary grid place-items-center border border-border">
                    <b.Icon className="w-4 h-4" />
                  </span>
                </div>
                <h4 className="mt-2 font-display font-semibold text-2xl">{b.name}</h4>
                <p className="mt-3 text-sm text-muted-foreground">{b.desc}</p>

                <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4 space-y-2 text-sm">
                  <Line label="Item Cost" value="$0.00" />
                  <Line label="UGF Network Fee" value={b.fee} violet />
                  <Line label="Native ETH Gas" value="0.00 ETH sponsored" mint />
                </div>
                <button className="mt-4 w-full rounded-full bg-[var(--violet)]/30 border border-[var(--violet)]/40 text-foreground/80 px-4 py-2.5 text-sm hover:bg-[var(--violet)]/40 transition">
                  Connect to Claim
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ label, value, violet, mint }: { label: string; value: string; violet?: boolean; mint?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={violet ? "text-[var(--violet)]" : mint ? "text-[var(--mint)]" : ""}>{value}</span>
    </div>
  );
}
