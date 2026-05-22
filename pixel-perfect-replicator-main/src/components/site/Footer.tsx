import { Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-16">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-full border border-border bg-card">
              <Link2 className="w-3.5 h-3.5" />
            </span>
            <span className="font-display font-semibold tracking-[0.3em] text-sm">GASLESSIO</span>
          </div>


          <p className="mt-5 text-sm text-muted-foreground max-w-xs">
            A beginner-friendly dApp on Base Sepolia. Pay gas in Mock USD with the Universal Gas Framework — never touch ETH.
          </p>
          <div className="mt-6 font-mono-label text-[var(--violet)]">Built on Base</div>
        </div>
        <FooterCol title="Product" links={["Features", "How It Works", "Dashboard", "Rewards", "Launch App"]} />
        <FooterCol title="Resources" links={["GitHub", "UGF Docs ↗", "BaseScan ↗"]} />
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-12 pt-6 border-t border-border/40 flex justify-between text-xs text-muted-foreground">
        <span>© 2026 Gaslessio. Universal Gas Framework.</span>
        <span className="font-mono">0x5f4a79…8b21CF93</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="font-mono-label text-[var(--violet)]">{title}</div>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l}><a href="#" className="text-muted-foreground hover:text-foreground transition">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
