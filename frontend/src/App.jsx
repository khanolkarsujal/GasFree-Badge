import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ArrowRight,
  ExternalLink,
  FileText,
  Check,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { executeGaslessClaim } from "@/services/ugfService";
import { BADGES } from "@/lib/constants";
import { CONTRACT_ADDRESS } from "@/contractConfig";
import { ClaimModal } from "@/components";

const isDeployed = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

function Nav({ wallet }) {
  return (
    <header className="relative z-20 border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.45_0.2_295)] to-[oklch(0.3_0.18_285)] shadow-[0_0_24px_-4px_oklch(0.6_0.2_295/0.6)]">
            <Shield className="h-4 w-4 text-white" />
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-tight text-white">GasFreeBadge</span>
        </a>
        <nav className="hidden items-center gap-9 text-sm text-muted-foreground md:flex">
          <a href="#contract" className="transition-colors hover:text-white">Contract</a>
          <a href="#docs" className="transition-colors hover:text-white">UGF Docs</a>
        </nav>
        <button
          onClick={wallet.account ? undefined : wallet.connect}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.4)]"
        >
          {wallet.account
            ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}

function Hero({ stats, wallet, onConnect }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Digital
            <br />
            credentials.
            <br />
            <span className="bg-gradient-to-b from-[oklch(0.85_0.14_295)] to-[oklch(0.6_0.22_295)] bg-clip-text text-transparent">
              Zero gas
            </span>
            <br />
            <span className="bg-gradient-to-b from-[oklch(0.85_0.14_295)] to-[oklch(0.6_0.22_295)] bg-clip-text text-transparent">
              friction.
            </span>
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Issue verifiable NFT badges on Base Sepolia without forcing users to hold ETH. By leveraging
            the Universal Gas Framework (UGF), we make on-chain credentialing feel completely invisible
            to the end user.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={wallet.account ? undefined : onConnect}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
            >
              {wallet.account
                ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`
                : "Connect Wallet"}
            </button>
            <a
              href="#catalog"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Try demo flow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <a
            href="#"
            onClick={handleCopy}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs relative"
          >
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">Contract</span>
            <span className="font-mono text-white/90">
              {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}
            </span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: -25 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] rounded font-bold shadow-lg pointer-events-none whitespace-nowrap z-50"
                >
                  Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </a>
          <div className="mt-6 grid max-w-lg grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <Stat label="Gas cost" value={<span className="text-[oklch(0.78_0.17_160)]">0 ETH</span>} sub="sponsored by UGF" />
            <Stat label="Claimed" value={<><span className="text-white">{stats.minted}</span><span className="text-muted-foreground"> /{stats.total.toLocaleString()}</span></>} divider />
            <Stat label="Network" value={<span className="flex items-center gap-2 text-white"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.17_160)]" />Base Sepolia</span>} divider />
          </div>
        </div>

        <CredentialCard isWalletReady={!!wallet.account} />
      </div>
    </section>
  );
}

function Stat({ label, value, sub, divider }) {
  return (
    <div className={`p-4 ${divider ? "border-l border-white/10" : ""}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-semibold">{value}</div>
      {sub && <div className="mt-1 text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function CredentialCard({ isWalletReady }) {
  return (
    <div
      className="relative rounded-3xl border border-white/10 p-6 shadow-[0_30px_80px_-20px_rgba(120,80,220,0.35)] sm:p-7"
      style={{ background: "var(--gradient-card)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Credential preview</div>
          <h3 className="mt-2 font-heading text-2xl font-bold text-white">Professional Badge</h3>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.2_295)] to-[oklch(0.5_0.22_290)] shadow-[0_0_24px_-4px_oklch(0.6_0.22_295/0.7)]">
          <Shield className="h-5 w-5 text-white" />
        </span>
      </div>
      <div className="mt-6 space-y-2.5">
        <Row label="Wallet status" value={<span className="text-[oklch(0.78_0.17_160)]">{isWalletReady ? "Connected" : "Ready to claim"}</span>} />
        <Row label="Gas sponsor" value="GasFreeBadge" />
        <Row label="Verification" value="BaseScan linked" />
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
          <FileText className="h-4 w-4 text-white/80" />
        </span>
        <div>
          <div className="text-sm font-semibold text-white">
            {isWalletReady ? "Wallet Connected" : "Wallet Connection Required"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {isWalletReady ? "Choose any badge from the catalog below to claim it instantly." : "Connect your wallet to claim a badge. No ETH is required."}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function BadgeCatalogSection({ badges, claimed, isWalletReady, onClaim, wallet, isClaiming }) {
  return (
    <section id="catalog" className="mx-auto max-w-7xl px-6 py-16 border-t border-white/5">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.75_0.18_295)]">Catalog</div>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">Available Credentials</h2>
          <p className="mt-3 text-sm text-muted-foreground">Verifiable on-chain badges powered by UGF. Gas is 100% sponsored.</p>
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.17_160)]" />
          <span className="text-white/80 font-semibold">
            {isWalletReady ? `${claimed.length} of ${badges.length} collected` : "Connect wallet to view status"}
          </span>
        </div>
      </div>

      {!isDeployed && (
        <div className="mb-6 flex items-start gap-4 px-5 py-4 rounded-2xl bg-amber-950/10 border border-amber-500/20 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="pt-0.5">
            <p className="text-sm font-semibold text-amber-50 tracking-tight">Contract Missing</p>
            <p className="text-xs text-amber-500/80 mt-1 leading-relaxed">
              The smart contract is not deployed yet. Please run <code className="font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-400">npx hardhat run scripts/deploy.js</code>
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const isClaimed = isWalletReady && claimed.includes(badge.id);
          return (
            <div
              key={badge.id}
              className="relative rounded-3xl border border-white/10 p-6 flex flex-col justify-between"
              style={{ background: "var(--gradient-card)" }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{badge.rarity} Badge</div>
                    <h3 className="mt-2 font-heading text-xl font-bold text-white">{badge.name}</h3>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                    <span className="text-lg">{badge.icon}</span>
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground min-h-[40px]">{badge.desc}</p>
                
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs">
                    <span className="text-muted-foreground">Status</span>
                    <span className={isClaimed ? "text-emerald-400 font-semibold" : "text-white"}>
                      {isClaimed ? "Collected" : "Ready to claim"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs">
                    <span className="text-muted-foreground">Gas fee</span>
                    <span className="text-emerald-400 font-semibold">Sponsored</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isClaimed || isClaiming || !isDeployed}
                onClick={isWalletReady ? () => onClaim(badge) : wallet.connect}
                className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  isClaimed
                    ? "bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 cursor-default"
                    : "bg-white text-black hover:bg-white/90 cursor-pointer"
                }`}
              >
                {isClaimed ? "Collected" : isWalletReady ? "Claim Badge" : "Connect to Claim"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MyCollectionSection({ claimed, badges }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl border border-white/10 p-6 bg-white/[0.02]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">Your collection</div>
        <h3 className="mt-2 font-heading text-xl font-bold text-white">Collected Badges</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {claimed.map((id) => {
            const badge = badges.find((b) => b.id === id);
            if (!badge) return null;
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/10 px-4 py-2 text-xs font-semibold text-emerald-400">
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
                <Check className="h-3 w-3" />
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
      <Card>
        <Eyebrow color="purple">Core problem</Eyebrow>
        <h2 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
          Web3 UX breaks when users need ETH.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          You want to reward your community, but forcing beginners to find a faucet or bridge ETH just
          to claim a badge is a massive roadblock. On-chain actions shouldn't require native tokens.
        </p>
      </Card>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-md">
            <Eyebrow color="green">Solution overview</Eyebrow>
            <h2 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
              Making the blockchain invisible.
            </h2>
          </div>
          <div className="max-w-[260px] rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-muted-foreground">
            GasFreeBadge uses UGF to route the claim action behind the scenes. The user connects, clicks claim, and the transaction is settled seamlessly—no ETH required.
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MiniCard title="Never Touch ETH" desc="Users don't need a gas token. If a user has an empty wallet, they can still claim their badge instantly." />
          <MiniCard title="Built on Base Sepolia" desc="Fast, secure, and verifiable credentials powered by scalable L2 infrastructure." />
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[oklch(0.16_0.05_290)] to-[oklch(0.1_0.03_280)] p-5">
          <h4 className="font-heading text-lg font-bold text-white">Real & Useful Value</h4>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Designed for hackathons, bootcamps, and professional communities that need a credentialing flow people can actually use.
          </p>
        </div>
      </Card>
    </section>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 p-7 sm:p-9 ${className}`}
      style={{ background: "var(--gradient-card)" }}
    >
      {children}
    </div>
  );
}

function MiniCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="font-heading text-xl font-bold text-white">{title}</div>
      <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</div>
    </div>
  );
}

function Eyebrow({ children, color }) {
  const c = color === "purple" ? "text-[oklch(0.75_0.18_295)]" : color === "green" ? "text-[oklch(0.78_0.17_160)]" : "text-[oklch(0.7_0.18_250)]";
  return <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${c}`}>{children}</div>;
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="pt-2">
          <Eyebrow color="purple">Key features</Eyebrow>
          <h2 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
            A flawless Web3 experience for everyone.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            We stripped away the complexity of gas networks so your users can focus on their achievements.
          </p>
        </div>
        <div
          className="rounded-3xl border border-[oklch(0.5_0.2_295/0.4)] p-7 shadow-[0_0_60px_-20px_oklch(0.5_0.2_295/0.6)]"
          style={{ background: "linear-gradient(155deg, oklch(0.18 0.06 290), oklch(0.1 0.03 280))" }}
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
            <Check className="h-4 w-4 text-white" />
          </span>
          <h3 className="mt-12 font-heading text-2xl font-bold text-white">Powered by UGF</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We utilize the Universal Gas Framework to absorb network costs via Mock USD, entirely removing the first-time user barrier.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Feature icon={<ShieldCheck className="h-4 w-4 text-[oklch(0.78_0.17_160)]" />} title="Permanent Ownership" desc="Badges live entirely on-chain, creating a permanent, verifiable record of achievement." />
        <Feature icon={<FileText className="h-4 w-4 text-[oklch(0.75_0.18_295)]" />} title="Clear & Transparent" desc="Users see exactly what they earned and who issued it before they sign any action." />
        <Feature icon={<FileText className="h-4 w-4 text-[oklch(0.7_0.18_250)]" />} title="Easily Verifiable" desc="Contract details, UGF documentation, and BaseScan links are always accessible." />
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <Card className="!p-7">
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">{icon}</span>
      <h4 className="mt-5 font-heading text-lg font-bold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </Card>
  );
}

function Workflow() {
  const steps = [
    { n: "01", t: "Connect Wallet", d: "The user connects a preferred wallet. Absolutely no ETH is required to start.", c: "text-[oklch(0.75_0.18_295)]" },
    { n: "02", t: "Claim via UGF", d: "GasFreeBadge routes the transaction through the Universal Gas Framework so the user never worries about network fees.", c: "text-[oklch(0.78_0.17_160)]" },
    { n: "03", t: "Own & Verify", d: "The badge becomes an inspectable on-chain credential with a clear contract trail on BaseScan.", c: "text-[oklch(0.7_0.18_250)]" },
  ];
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <Eyebrow color="green">Product workflow</Eyebrow>
        <h2 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
          Three steps from wallet to credential.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A simple 'quote, settle, execute' flow that anyone can complete in seconds.
        </p>
      </div>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <span className={`font-heading text-2xl font-bold ${s.c}`}>{s.n}</span>
            <div>
              <h4 className="font-heading text-lg font-bold text-white">{s.t}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tech({ wallet }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-3">
      <div className="pt-2">
        <Eyebrow color="blue">Tech stack / innovation</Eyebrow>
        <h2 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
          Abstracting away the complexity.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          GasFreeBadge focuses on one practical unlock: using UGF to make on-chain actions feel as simple as Web2, without relying on paymasters or bundlers.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Base Sepolia", "Solidity", "ERC-721", "Gas sponsorship", "Wallet signatures"].map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-semibold text-white">
              {t}
            </span>
          ))}
        </div>
      </div>
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Demo preview</div>
          <span className="rounded-full bg-[oklch(0.25_0.1_160)] px-3 py-1 text-[10px] font-semibold text-[oklch(0.85_0.17_160)]">Live MVP</span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-bold text-white">Claim console</h3>
        <div className="mt-5 space-y-2.5">
          <Row label="Wallet" value={wallet.account ? <span className="text-[oklch(0.78_0.17_160)]">Ready</span> : <span className="text-white/60">Not Connected</span>} />
          <Row label="Estimated gas" value={<span className="text-[oklch(0.78_0.17_160)]">Sponsored</span>} />
          <Row label="Badge supply" value="10,000 max" />
        </div>
        <button
          onClick={wallet.account ? undefined : wallet.connect}
          className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          {wallet.account ? "Connected" : "Connect Wallet"}
        </button>
      </Card>
      <Card>
        <Eyebrow color="green">Hackathon alignment</Eyebrow>
        <h3 className="mt-5 font-heading text-2xl font-bold text-white">Fulfilling the UGF Vision.</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Building a beginner-friendly dApp that does something real.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Dot c="purple" />Uses UGF React SDK</li>
          <li className="flex items-center gap-2"><Dot c="green" />Deployed on Base Sepolia</li>
          <li className="flex items-center gap-2"><Dot c="blue" />Users never touch ETH</li>
          <li className="flex items-center gap-2"><Dot c="purple" />Real-world NFT credential use case</li>
        </ul>
      </Card>
    </section>
  );
}

function Dot({ c }) {
  const col = c === "purple" ? "bg-[oklch(0.75_0.18_295)]" : c === "green" ? "bg-[oklch(0.78_0.17_160)]" : "bg-[oklch(0.7_0.18_250)]";
  return <span className={`h-1.5 w-1.5 rounded-full ${col}`} />;
}

function CTA({ wallet, onConnect }) {
  return (
    <section className="border-t border-white/10 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 p-8 sm:p-12 lg:flex-row lg:items-center"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="max-w-xl">
            <Eyebrow color="purple">Need this?</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
              Experience invisible Web3.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Connect a wallet below to try the live demo. See firsthand how UGF removes technical friction to create a magical user experience.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={wallet.account ? undefined : onConnect}
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
            >
              {wallet.account ? "Connected" : "Connect Wallet"}
            </button>
            <a
              href="#catalog"
              className="rounded-full border border-white/15 bg-white/[0.03] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 text-center"
            >
              View Credentials
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.45_0.2_295)] to-[oklch(0.3_0.18_285)]">
            <Shield className="h-3.5 w-3.5 text-white" />
          </span>
          <div>
            <div className="text-sm font-semibold text-white">GasFreeBadge</div>
            <div className="text-[11px] text-muted-foreground">UGF Hackathon 2026</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#contract" className="hover:text-white">Contract</a>
          <a href="#docs" className="hover:text-white">UGF Docs</a>
          <a href="#" className="inline-flex items-center gap-1 hover:text-white">BaseScan <ExternalLink className="h-3 w-3" /></a>
        </div>
      </div>
      <div className="flex justify-center pb-8">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.75_0.18_295)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.75_0.18_295)]" />
          Built on Base
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  const wallet = useWallet();
  const collection = useCollection(wallet.account);

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [claimError, setClaimError] = useState("");

  const isClaiming = activeStep > 0 && !txHash && !claimError;
  const isWalletReady = wallet.account && wallet.isRightChain;

  useEffect(() => {
    collection.refresh(wallet.account);
    const id = setInterval(() => collection.refresh(wallet.account), 30_000);
    return () => clearInterval(id);
  }, [wallet.account]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClaim = async (badge) => {
    if (!isWalletReady || isClaiming) return;

    setSelectedBadge(badge);
    setClaimError("");
    setTxHash("");
    setActiveStep(1);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const hash = await executeGaslessClaim(signer, setActiveStep);
      setTxHash(hash);
      setActiveStep(5);
      await collection.refresh();
    } catch (err) {
      const msg = err?.message ?? String(err);
      const mapped =
        msg === "NO_MOCK_USD"
          ? "NO_MOCK_USD"
          : msg === "MAX_SUPPLY"
          ? "All badges have been claimed."
          : msg === "PAUSED"
          ? "Claiming is paused."
          : msg.includes("user rejected")
          ? "Signature cancelled."
          : msg.length > 120
          ? `${msg.slice(0, 120)}...`
          : msg;

      setClaimError(mapped);
      setActiveStep(0);
    }
  };

  const handleModalClose = () => {
    if (isClaiming) return;
    setSelectedBadge(null);
    setActiveStep(0);
    setTxHash("");
    setClaimError("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden">
      <Nav wallet={wallet} />
      
      <main>
        <Hero
          stats={collection.stats}
          wallet={wallet}
          onConnect={wallet.connect}
        />

        {isWalletReady && collection.claimed.length > 0 && (
          <MyCollectionSection
            claimed={collection.claimed}
            badges={BADGES}
          />
        )}

        <BadgeCatalogSection
          badges={BADGES}
          claimed={collection.claimed}
          isWalletReady={isWalletReady}
          onClaim={handleClaim}
          wallet={wallet}
          isClaiming={isClaiming}
        />

        <ProblemSolution />
        <Features />
        <Workflow />
        <Tech wallet={wallet} />
        <CTA wallet={wallet} onConnect={wallet.connect} />
      </main>

      <Footer />

      <ClaimModal
        badge={selectedBadge}
        activeStep={activeStep}
        txHash={txHash}
        error={claimError}
        isOpen={!!selectedBadge}
        onClose={handleModalClose}
      />
    </div>
  );
}
