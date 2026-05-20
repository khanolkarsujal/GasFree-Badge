import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";

interface NavbarProps {
  wallet: any;
  collection: any;
  platform: any;
  platformAuth: any;
  setPlatformTick: React.Dispatch<React.SetStateAction<number>>;
}

const nav = [
  { label: "Dashboard", href: "#dashboard" },
];

export function Navbar({ wallet, collection, platform, platformAuth, setPlatformTick }: NavbarProps) {
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
            <a key={n.label} href={n.href} className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full font-medium">
              {n.label}
            </a>
          ))}
          <a
            href="https://github.com/khanolkarsujal/GasFree-Badge#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full font-medium"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Chain Balance (TYI) */}
          {wallet.account && wallet.isRightChain && collection && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card/40 px-3.5 py-2 text-xs text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
              <span className="font-semibold text-white/90">
                {collection.tyiBalance !== null ? `${collection.tyiBalance.toFixed(2)} TYI` : "0.00 TYI"}
              </span>
              <span className="text-white/40 font-mono-label">chain</span>
            </div>
          )}

          {/* Main Wallet Connection Trigger */}
          <button
            onClick={
              !wallet.account
                ? wallet.connect
                : !wallet.isRightChain
                ? wallet.switchToBaseSepolia
                : undefined
            }
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              wallet.account && !wallet.isRightChain
                ? "bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                : "bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] text-white shadow-[0_0_30px_oklch(0.7_0.22_295_/_0.5)] hover:opacity-90"
            }`}
          >
            {!wallet.account
              ? "Connect Wallet"
              : !wallet.isRightChain
              ? "Switch Network"
              : `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`}
          </button>
        </div>
      </div>
    </header>
  );
}
