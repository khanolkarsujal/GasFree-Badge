import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";

const nav = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Rewards", href: "#rewards" },
  { label: "GitHub", href: "#github" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative grid place-items-center w-8 h-8 rounded-full border border-border bg-card">
            <Link2 className="w-3.5 h-3.5 text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--mint)] shadow-[0_0_8px_var(--mint)]" />
          </span>
          <span className="font-display font-semibold tracking-[0.3em] text-sm">GASLESSIO</span>
        </Link>



        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/60 px-2 py-1.5 backdrop-blur">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full">
              {n.label}
            </a>
          ))}
        </nav>

        <button className="rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] px-5 py-2 text-sm font-medium text-white shadow-[0_0_30px_oklch(0.7_0.22_295_/_0.5)] hover:opacity-90 transition">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
