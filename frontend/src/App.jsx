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
  CreditCard,
  Cpu,
  Coins,
  ArrowUpRight,
  Sparkles,
  Send,
  Gift,
  Play,
  Terminal,
  Settings,
  Activity,
  CheckCircle2,
  Wallet,
  AlertCircle,
  RefreshCw,
  Unlock,
  Compass,
  GitBranch,
} from "lucide-react";


import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { executeGaslessClaim, executeGaslessTokenTransfer } from "@/services/ugfService";
import { BADGES } from "@/lib/constants";
import { CONTRACT_ADDRESS } from "@/contractConfig";
import { ClaimModal } from "@/components";
import { basescanAddress, copyToClipboard } from "@/lib/utils";

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
          <a
            href={basescanAddress(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Contract
          </a>
          <a
            href="https://github.com/khanolkarsujal/GasFree-Badge#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            UGF Docs
          </a>
        </nav>
        <button
          onClick={
            !wallet.account
              ? wallet.connect
              : !wallet.isRightChain
              ? wallet.switchToBaseSepolia
              : undefined
          }
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.4)] ${
            wallet.account && !wallet.isRightChain
              ? "bg-amber-500 hover:bg-amber-400 text-black cursor-pointer font-bold"
              : "bg-white hover:bg-white/90 text-black"
          }`}
        >
          {!wallet.account
            ? "Connect Wallet"
            : !wallet.isRightChain
            ? "Switch Network"
            : `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`}
        </button>
      </div>
    </header>
  );
}

function Hero({ stats, wallet, onConnect }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    const success = await copyToClipboard(CONTRACT_ADDRESS);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
              onClick={
                !wallet.account
                  ? onConnect
                  : !wallet.isRightChain
                  ? wallet.switchToBaseSepolia
                  : undefined
              }
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                wallet.account && !wallet.isRightChain
                  ? "bg-amber-500 hover:bg-amber-400 text-black cursor-pointer font-bold"
                  : "bg-white hover:bg-white/90 text-black"
              }`}
            >
              {!wallet.account
                ? "Connect Wallet"
                : !wallet.isRightChain
                ? "Switch to Base Sepolia"
                : `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`}
            </button>
            {wallet.account && (
              <button
                onClick={wallet.addTYIToken}
                className="group flex items-center gap-2 rounded-full border border-[oklch(0.75_0.18_295/0.3)] bg-[oklch(0.75_0.18_295/0.1)] px-6 py-3 text-sm font-semibold text-[oklch(0.75_0.18_295)] hover:bg-[oklch(0.75_0.18_295/0.2)] transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>➕</span> Add TYI to Wallet
              </button>
            )}
            <a
              href="#catalog"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Try demo flow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <button
            onClick={handleCopy}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs relative hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
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
          </button>
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
      className="relative rounded-3xl border border-white/10 p-6 shadow-[0_30px_80px_-20px_rgba(120,80,220,0.35)] sm:p-7 transition-all duration-500 hover:shadow-[0_30px_80px_-10px_rgba(120,80,220,0.5)] hover:-translate-y-1"
      style={{ background: "var(--gradient-card)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Credential preview</div>
          <h3 className="mt-2 font-heading text-2xl font-bold text-white">Professional Badge</h3>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.2_295)] to-[oklch(0.5_0.22_290)] shadow-[0_0_24px_-4px_oklch(0.6_0.22_295/0.7)] animate-float">
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

function PaymentsPlayground({
  donationAmount,
  setDonationAmount,
  paymentCompleted,
  setPaymentCompleted,
  subscriptionEnabled,
  setSubscriptionEnabled,
  runSimulation,
  simActive,
}) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="font-heading text-2xl font-bold text-white">Track 2: Checkout & Recurring Payments</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Abstracting checkout friction. Accept mock USD payments, donations, and set up recurring billing without requiring native ETH.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Donation Widget */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-white/20 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[oklch(0.75_0.18_295)] uppercase tracking-wider">Gasless Donation</span>
              <Coins className="h-4 w-4 text-[oklch(0.75_0.18_295)]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">Support GasFreeBadge</h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Donate stablecoins gaslessly to fuel open-source developers. The framework handles the exchange gas fees.
            </p>
            
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                {["5", "10", "25"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDonationAmount(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      donationAmount === val 
                        ? "bg-white text-black border-white" 
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {val} TYI
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Custom amount..."
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[oklch(0.75_0.18_295)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">TYI</span>
              </div>
            </div>
          </div>
          
          <button
            disabled={simActive || !donationAmount}
            onClick={() => runSimulation("Donation", `${donationAmount} TYI`)}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {simActive ? "Executing Transaction..." : `Donate ${donationAmount || 0} TYI Gaslessly`}
          </button>
        </div>

        {/* Card 2: Checkout Mock */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-white/20 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[oklch(0.78_0.17_160)] uppercase tracking-wider">Gasless Checkout</span>
              <CreditCard className="h-4 w-4 text-[oklch(0.78_0.17_160)]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">SaaS Dev License</h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Experience an elegant commercial checkout. Buy a simulated developer license with mock stablecoins.
            </p>
            
            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/30 p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pro License</span>
                <span className="text-white font-bold">$15.00</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">UGF Gas fee</span>
                <span className="text-emerald-400 font-semibold">$0.00 (Sponsored)</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>$15.00 mock USD</span>
              </div>
            </div>
          </div>
          
          <button
            disabled={simActive}
            onClick={() => runSimulation("Checkout", "$15.00 Mock USD")}
            className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
              paymentCompleted
                ? "bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 cursor-default"
                : "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            }`}
          >
            {paymentCompleted ? "License Purchased!" : simActive ? "Checking out..." : "Complete Gasless Checkout"}
          </button>
        </div>

        {/* Card 3: Subscription Panel */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-white/20 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[oklch(0.7_0.18_250)] uppercase tracking-wider">Subscriptions</span>
              <Activity className="h-4 w-4 text-[oklch(0.7_0.18_250)]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">UGF API Hub Plan</h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Enable automated, recurring subscription logic. Users sign once; future debits require zero manual clicks.
            </p>
            
            <div className="mt-4 p-4 rounded-2xl border border-white/[0.06] bg-black/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Developer API Hub</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">$9.99 / month</div>
              </div>
              <button
                disabled={simActive}
                onClick={async () => {
                  if (subscriptionEnabled) {
                    setSubscriptionEnabled(false);
                  } else {
                    await runSimulation("Subscription Permit", "$9.99/mo");
                    setSubscriptionEnabled(true);
                  }
                }}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none ${
                  subscriptionEnabled ? "bg-emerald-500" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                    subscriptionEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            
            <div className="mt-4 text-[10px] text-muted-foreground text-center">
              {subscriptionEnabled ? (
                <span className="text-emerald-400 font-semibold">✓ Gasless Auto-Billing Pre-Authorized</span>
              ) : (
                "Authorize gasless auto-debit permit"
              )}
            </div>
          </div>
          
          <div className="mt-6 text-[11px] border border-white/5 rounded-xl px-3 py-2 bg-black/20 text-muted-foreground flex justify-between items-center leading-none">
            <span>Subscription Status:</span>
            <span className={subscriptionEnabled ? "text-emerald-400 font-bold" : "text-white/60 font-bold"}>
              {subscriptionEnabled ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgenticPlayground({
  transferRecipient,
  setTransferRecipient,
  transferAmount,
  setTransferAmount,
  agentPreauthorized,
  setAgentPreauthorized,
  agentLogs,
  runSimulation,
  simActive,
}) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="font-heading text-2xl font-bold text-white">Track 3: Token Transfers & AI Agents</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Deploy smart agents and transfer tokens with zero gas. Enable agentic wallets to execute autonomous transactions gaslessly using pre-authorized session permissions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Token Sender */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-white/20 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[oklch(0.75_0.18_295)] uppercase tracking-wider">Token Sender</span>
              <Send className="h-4 w-4 text-[oklch(0.75_0.18_295)]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">Gasless Send Token</h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Transfer mock assets or stablecoins to any recipient address gaslessly. Zero ETH required in either wallet.
            </p>
            
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[oklch(0.75_0.18_295)]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="100"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[oklch(0.75_0.18_295)]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">TYI</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            disabled={simActive || !transferRecipient || !transferAmount}
            onClick={() => runSimulation("Transfer", `${transferAmount} TYI to ${transferRecipient.slice(0, 6)}...`)}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {simActive ? "Sending..." : "Send Tokens Gaslessly"}
          </button>
        </div>

        {/* Card 2: Rewards Claim */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-white/20 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[oklch(0.78_0.17_160)] uppercase tracking-wider">Loyalty Rewards</span>
              <Gift className="h-4 w-4 text-[oklch(0.78_0.17_160)]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">1-Click Reward Chest</h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Earned loyalty points or rewards? Claim them gaslessly in a single sign action. Ideal for onboarding new users.
            </p>
            
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center">
              <span className="text-4xl animate-float block">🎁</span>
              <span className="mt-3 block text-xs text-white font-bold">100 Testnet XP Pending</span>
              <span className="text-[10px] text-emerald-400 mt-1 block">Sponsor: GasFreeBadge</span>
            </div>
          </div>
          
          <button
            disabled={simActive}
            onClick={() => runSimulation("Reward Claim", "100 XP Rewards")}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {simActive ? "Claiming..." : "Claim 100 XP Gaslessly"}
          </button>
        </div>

        {/* Card 3: Agentic Wallet */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-white/20 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[oklch(0.7_0.18_250)] uppercase tracking-wider">Agent Autonomy</span>
              <Cpu className="h-4 w-4 text-[oklch(0.7_0.18_250)]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">AI Agent Controller</h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Authorize an AI Agent session. The agent trades or checks yield autonomously, paying zero manual gas fees per trade.
            </p>
            
            <div className="mt-4 p-4 rounded-2xl border border-white/[0.06] bg-black/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">DeFi Yield Router Agent</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Quota: 50 TYI Daily</div>
              </div>
              <button
                disabled={simActive}
                onClick={async () => {
                  if (agentPreauthorized) {
                    setAgentPreauthorized(false);
                  } else {
                    await runSimulation("Agent Pre-Authorization", "50 TYI Daily Cap");
                    setAgentPreauthorized(true);
                  }
                }}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none ${
                  agentPreauthorized ? "bg-[oklch(0.75_0.18_295)]" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                    agentPreauthorized ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-[11px] border border-white/5 rounded-xl px-3 py-2 bg-black/20 text-muted-foreground flex justify-between items-center leading-none">
            <span>Agent Active Status:</span>
            <span className={agentPreauthorized ? "text-emerald-400 font-bold" : "text-white/60 font-bold"}>
              {agentPreauthorized ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Activity scrolling terminal inside card footer */}
      {agentPreauthorized && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5 font-mono text-xs text-white max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-sans font-bold text-white text-[11px] uppercase tracking-wider">Agentic Live Stream Feed</span>
          </div>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar text-white/70">
            {agentLogs.map((log, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-indigo-400 font-semibold">[{log.time}]</span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UGFTerminal({
  simActive,
  simStep,
  simLogs,
  simSuccess,
  simTxHash,
  simError,
  setSimError,
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-12 rounded-3xl border border-white/10 bg-black/50 p-6 font-mono text-xs leading-relaxed max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
    >
      {/* Dynamic Glowing Cyber Grid and Scanline when active */}
      {simActive && (
        <>
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] animate-[pulse_1.5s_infinite]" />
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.75_0.18_295/0.25)] to-transparent pointer-events-none animate-scan z-10" />
        </>
      )}
      
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_70%)]" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[oklch(0.75_0.18_295)] animate-pulse" />
          <span className="font-sans font-bold text-white">UGF Gasless Transaction Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${simActive ? "bg-amber-400 animate-pulse" : simSuccess ? "bg-emerald-500 animate-pulse" : simError ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
          <span className="font-sans text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            {simActive ? "Executing Transaction" : simSuccess ? "Session Success" : simError ? "Execution Failed" : "Ready"}
          </span>
        </div>
      </div>
      
      {/* Steps Indicator */}
      {(simActive || simSuccess) && (
        <div className="relative z-10 grid grid-cols-4 gap-2 mb-6 font-sans">
          {[
            { step: 1, label: "Auth (EIP-191)" },
            { step: 2, label: "Quote (Mock USD)" },
            { step: 3, label: "Settle (ERC-3009)" },
            { step: 4, label: "Execute (Sponsor)" }
          ].map((s) => (
            <div key={s.step} className="flex flex-col gap-1.5">
              <div className="h-1.5 rounded-full overflow-hidden bg-white/10 relative">
                <motion.div 
                  className={`h-full relative overflow-hidden ${
                    simStep === s.step 
                      ? "bg-gradient-to-r from-[oklch(0.75_0.18_295)] to-[oklch(0.85_0.14_295)]" 
                      : "bg-gradient-to-r from-[oklch(0.85_0.14_295)] to-[oklch(0.65_0.2_295)]"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: simStep > s.step 
                      ? "100%" 
                      : simStep === s.step 
                      ? "65%" 
                      : "0%" 
                  }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                >
                  {simStep === s.step && (
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_1.8s_infinite]" style={{ width: "200%", left: "-50%" }} />
                  )}
                </motion.div>
              </div>
              <span className={`text-[10px] font-bold transition-colors duration-300 ${
                simStep > s.step 
                  ? "text-emerald-400 font-bold" 
                  : simStep === s.step 
                  ? "text-[oklch(0.75_0.18_295)] font-extrabold" 
                  : "text-muted-foreground"
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Logs list */}
      <div className="relative z-10 space-y-2 min-h-[150px] max-h-[220px] overflow-y-auto custom-scrollbar font-mono text-[#a8afc0] pr-2">
        {simLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic font-sans">
            No active transaction. Trigger a Payment or Wallet/Agent action above to inspect live execution.
          </div>
        ) : (
          simLogs.map((log, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 6, filter: "blur(1px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <span className="text-[oklch(0.75_0.18_295)] shrink-0 font-semibold select-none">[{log.time}]</span>
              <span className={
                log.text.includes("success") || log.text.includes("successful") || log.text.includes("successfully")
                  ? "text-emerald-400 font-semibold"
                  : log.text.includes("failed") || log.text.includes("Error")
                  ? "text-red-400 font-semibold animate-pulse"
                  : log.text.includes("Step")
                  ? "text-white font-semibold"
                  : ""
              }>
                {log.text}
              </span>
            </motion.div>
          ))
        )}
      </div>
      
      {/* JAW-DROPPING SUCCESS RECEIPT CARD */}
      {simSuccess && simTxHash && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
          className="relative z-10 mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(16,185,129,0.12)] overflow-hidden backdrop-blur-md"
        >
          {/* Neon radial backdrop */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)]" />
          
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(16,185,129,0.15)] animate-pulse">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">UGF remote execution confirmed!</div>
            <h4 className="font-heading text-base font-bold text-white mt-1">Transaction Settled Gaslessly</h4>
            
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-sans border-t border-white/5 pt-3.5">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">Native ETH Cost:</span>
                <span className="text-emerald-400 font-extrabold">0.00 ETH (100% Sponsored)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">Settlement Asset:</span>
                <span className="text-white font-semibold">TYI Mock USD</span>
              </div>
              <div className="flex justify-between col-span-1 sm:col-span-2 pt-1">
                <span className="text-muted-foreground">Transaction Hash:</span>
                <span className="text-indigo-300 font-mono text-[10px] truncate max-w-[200px] sm:max-w-sm md:max-w-md">{simTxHash}</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            <a
              href={simTxHash.startsWith("0x") && simTxHash.length === 66 ? `https://sepolia.basescan.org/tx/${simTxHash}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all text-center w-full shadow-md"
            >
              View on BaseScan <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      )}

      {/* JAW-DROPPING CYBERNETIC ERROR CARD */}
      {simError && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
          className="relative z-10 mt-6 rounded-2xl border border-red-500/20 bg-red-950/10 p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(239,68,68,0.12)] overflow-hidden backdrop-blur-md"
        >
          {/* Neon radial backdrop */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06),transparent_70%)]" />
          
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/35 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(239,68,68,0.15)]">
            <AlertCircle className="w-6 h-6 text-red-500 animate-bounce" />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">UGF remote execution failed</div>
            <h4 className="font-heading text-base font-bold text-white mt-1">Transaction Execution Halted</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {simError === "NO_MOCK_USD" 
                ? "Your wallet does not have sufficient Mock USD (TYI) stablecoins to cover the sponsored gas fee. Please acquire Mock USD from the official faucet."
                : `Error Reason: ${simError}`}
            </p>
          </div>
          
          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-2">
            {simError === "NO_MOCK_USD" && (
              <a
                href="https://universalgasframework.com/faucets"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-center w-full"
              >
                <Coins className="h-3.5 w-3.5" /> Faucet
              </a>
            )}
            <button
              onClick={() => setSimError("")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all text-center w-full"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function UGFPlaygroundsSection({
  badges,
  claimed,
  isWalletReady,
  onClaim,
  wallet,
  isClaiming,
  // Tab states
  activeTrack,
  setActiveTrack,
  // Donation states
  donationAmount,
  setDonationAmount,
  // Token send states
  transferRecipient,
  setTransferRecipient,
  transferAmount,
  setTransferAmount,
  // Simulation states
  simActive,
  simStep,
  simLogs,
  simSuccess,
  simTxHash,
  simError,
  setSimError,
  runSimulation,
  // Simulation actions
  paymentCompleted,
  setPaymentCompleted,
  subscriptionEnabled,
  setSubscriptionEnabled,
  agentPreauthorized,
  setAgentPreauthorized,
  agentLogs,
}) {
  return (
    <section id="catalog" className="mx-auto max-w-7xl px-6 py-16 border-t border-white/5 scroll-mt-20">
      {/* Title block */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.75_0.18_295)] bg-[oklch(0.75_0.18_295/0.1)] px-3 py-1.5 rounded-full border border-[oklch(0.75_0.18_295/0.2)]">
          UGF Core Playgrounds
        </span>
        <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
          Suggested Developer Tracks
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Select a track below to explore the versatility of the Universal Gas Framework (UGF). Try live on-chain operations or interact with instant visual simulations!
        </p>
      </div>

      {/* Modern tab switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl max-w-3xl mx-auto mb-12 backdrop-blur-md">
        <button
          onClick={() => setActiveTrack('minting')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTrack === 'minting'
              ? "bg-white text-black shadow-lg shadow-white/5 translate-y-[-1px]"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Minting & Credentials
        </button>
        <button
          onClick={() => setActiveTrack('payments')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTrack === 'payments'
              ? "bg-white text-black shadow-lg shadow-white/5 translate-y-[-1px]"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Payments & Checkout
        </button>
        <button
          onClick={() => setActiveTrack('wallet-agents')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTrack === 'wallet-agents'
              ? "bg-white text-black shadow-lg shadow-white/5 translate-y-[-1px]"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <Cpu className="h-4 w-4" />
          Wallet & AI Agents
        </button>
      </div>

      {/* Tab content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {activeTrack === 'minting' && (
            <div>
              <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">Track 1: NFT Badges & Certificates</h3>
                  <p className="mt-2 text-xs text-muted-foreground">Verifiable credentials minted directly to your address on Base Sepolia. 100% sponsored by UGF.</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.17_160)]" />
                  <span className="text-white/80 font-semibold">
                    {isWalletReady ? `${claimed.length} of ${badges.length} collected` : "Connect wallet to claim"}
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
                      className="relative rounded-3xl border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_50px_oklch(0.75_0.18_295/0.12)] hover:-translate-y-1 group/card"
                      style={{ background: "var(--gradient-card)" }}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{badge.rarity} Badge</div>
                            <h3 className="mt-2 font-heading text-xl font-bold text-white">{badge.name}</h3>
                          </div>
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 transition-transform duration-300 group-hover/card:scale-110">
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
                        onClick={
                          isClaimed
                            ? undefined
                            : !wallet.account
                            ? wallet.connect
                            : !wallet.isRightChain
                            ? wallet.switchToBaseSepolia
                            : () => onClaim(badge)
                        }
                        className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
                          isClaimed
                            ? "bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 cursor-default"
                            : wallet.account && !wallet.isRightChain
                            ? "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                            : "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                        }`}
                      >
                        {isClaimed
                          ? "Collected"
                          : !wallet.account
                          ? "Connect to Claim"
                          : !wallet.isRightChain
                          ? "Switch to Base Sepolia"
                          : "Claim Badge"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTrack === 'payments' && (
            <PaymentsPlayground
              donationAmount={donationAmount}
              setDonationAmount={setDonationAmount}
              paymentCompleted={paymentCompleted}
              setPaymentCompleted={setPaymentCompleted}
              subscriptionEnabled={subscriptionEnabled}
              setSubscriptionEnabled={setSubscriptionEnabled}
              runSimulation={runSimulation}
              simActive={simActive}
            />
          )}

          {activeTrack === 'wallet-agents' && (
            <AgenticPlayground
              transferRecipient={transferRecipient}
              setTransferRecipient={setTransferRecipient}
              transferAmount={transferAmount}
              setTransferAmount={setTransferAmount}
              agentPreauthorized={agentPreauthorized}
              setAgentPreauthorized={setAgentPreauthorized}
              agentLogs={agentLogs}
              runSimulation={runSimulation}
              simActive={simActive}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Shared visual execution terminal for simulation logs */}
      {activeTrack !== 'minting' && (
        <UGFTerminal
          simActive={simActive}
          simStep={simStep}
          simLogs={simLogs}
          simSuccess={simSuccess}
          simTxHash={simTxHash}
          simError={simError}
          setSimError={setSimError}
        />
      )}
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
      className={`rounded-3xl border border-white/10 p-7 sm:p-9 transition-all duration-300 hover:border-white/20 ${className}`}
      style={{ background: "var(--gradient-card)" }}
    >
      {children}
    </div>
  );
}

function MiniCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/15">
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
          <div key={s.n} className="flex items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/15">
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
          Normally, to do anything on Ethereum, you need ETH sitting in your wallet just to pay for the action. 
          <span className="text-white font-semibold"> UGF removes that requirement.</span> The user pays with Mock USD. UGF handles the rest and gets the transaction done.
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[oklch(0.75_0.18_295)] bg-[oklch(0.75_0.18_295/0.1)] px-3 py-2 rounded-lg border border-[oklch(0.75_0.18_295/0.2)] inline-block">
          No paymasters · No bundlers · No ERC-4337.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Base Sepolia", "Solidity", "ERC-721", "Gas sponsorship", "Wallet signatures"].map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 cursor-default">
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
          className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.4)]"
        >
          {wallet.account ? "Connected" : "Connect Wallet"}
        </button>
      </Card>
      <Card>
        <Eyebrow color="green">SDK & Ecosystem</Eyebrow>
        <h3 className="mt-5 font-heading text-2xl font-bold text-white">Developer Resources</h3>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Integrate the Universal Gas Framework (UGF) into your Web3 application with official developer tools:
        </p>
        <div className="mt-5 space-y-3">
          <a
            href="https://universalgasframework.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 text-xs text-white hover:text-[oklch(0.75_0.18_295)] transition-all group/res"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">Official Documentation</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-[oklch(0.75_0.18_295)] transition-colors" />
          </a>

          <a
            href="https://universalgasframework.com/docs/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 text-xs text-white hover:text-[oklch(0.75_0.18_295)] transition-all group/res"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold">Testnet Quickstart Guide</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-[oklch(0.75_0.18_295)] transition-colors" />
          </a>

          <a
            href="https://universalgasframework.com/faucets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 text-xs text-white hover:text-[oklch(0.75_0.18_295)] transition-all group/res"
          >
            <div className="flex items-center gap-2.5">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="font-semibold">Get Mock USD (Faucet)</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-[oklch(0.75_0.18_295)] transition-colors" />
          </a>

          <a
            href="https://www.npmjs.com/package/@tychilabs/ugf-testnet-js"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 text-xs text-white hover:text-[oklch(0.75_0.18_295)] transition-all group/res"
          >
            <div className="flex items-center gap-2.5">
              <Terminal className="h-4 w-4 text-red-400" />
              <span className="font-semibold">Core SDK (@tychilabs/ugf-testnet-js)</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-[oklch(0.75_0.18_295)] transition-colors" />
          </a>

          <a
            href="https://www.npmjs.com/package/@tychilabs/react-ugf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 text-xs text-white hover:text-[oklch(0.75_0.18_295)] transition-all group/res"
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span className="font-semibold">React SDK (@tychilabs/react-ugf)</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-[oklch(0.75_0.18_295)] transition-colors" />
          </a>

          <a
            href="https://github.com/TychiWallet/ugf-testnet-js"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 text-xs text-white hover:text-[oklch(0.75_0.18_295)] transition-all group/res"
          >
            <div className="flex items-center gap-2.5">
              <GitBranch className="h-4 w-4 text-blue-400" />
              <span className="font-semibold">GitHub Repository</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-[oklch(0.75_0.18_295)] transition-colors" />
          </a>
        </div>
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
              onClick={
                !wallet.account
                  ? onConnect
                  : !wallet.isRightChain
                  ? wallet.switchToBaseSepolia
                  : undefined
              }
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.4)] ${
                wallet.account && !wallet.isRightChain
                  ? "bg-amber-500 hover:bg-amber-400 text-black cursor-pointer font-bold"
                  : "bg-white hover:bg-white/90 text-black"
              }`}
            >
              {!wallet.account
                ? "Connect Wallet"
                : !wallet.isRightChain
                ? "Switch to Base Sepolia"
                : "Connected"}
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
          <a
            href={basescanAddress(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Contract
          </a>
          <a
            href="https://github.com/khanolkarsujal/GasFree-Badge#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            UGF Docs
          </a>
          <a
            href={basescanAddress(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white"
          >
            BaseScan <ExternalLink className="h-3 w-3" />
          </a>
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

  // Suggested Tracks Playground states
  const [activeTrack, setActiveTrack] = useState("minting");
  const [donationAmount, setDonationAmount] = useState("10");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [simActive, setSimActive] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState([]);
  const [simSuccess, setSimSuccess] = useState(false);
  const [simTxHash, setSimTxHash] = useState("");
  const [simError, setSimError] = useState("");

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [agentPreauthorized, setAgentPreauthorized] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  useEffect(() => {
    collection.refresh(wallet.account);
    const id = setInterval(() => collection.refresh(wallet.account), 30_000);
    return () => clearInterval(id);
  }, [wallet.account]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect for rolling autonomous AI agent simulation logs
  useEffect(() => {
    if (!agentPreauthorized) {
      setAgentLogs([]);
      return;
    }
    
    const initialLogs = [
      { time: new Date().toLocaleTimeString(), text: "[Agent] Autonomous yield routing agent initialized." },
      { time: new Date().toLocaleTimeString(), text: "[Agent] Pre-authorized daily gas quota: 50 TYI." }
    ];
    setAgentLogs(initialLogs);
    
    const actions = [
      "Analyzing liquidity pools in Base Sepolia...",
      "Sensed 0.4% price arbitrage on Uniswap vs Sushiswap...",
      "Executing gasless arbitrage trade... Sponsored 0 ETH gas!",
      "Harvested yield: +0.85 Mock USD. Trade completed.",
      "Scanning Aave lending market for stablecoin rate optimization...",
      "Rebalancing collateral from USDC to DAI gaslessly (UGF Session Active)...",
      "Yield reallocated. Portfolio value updated (+1.45 Mock USD)."
    ];
    
    let counter = 0;
    const interval = setInterval(() => {
      setAgentLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), text: `[Agent] ${actions[counter % actions.length]}` }
      ].slice(-8)); // keep last 8 logs
      counter++;
    }, 5000);
    
    return () => clearInterval(interval);
  }, [agentPreauthorized]);

  // Simulation runner for EIP-191 Auth -> Quoting -> EIP-712/ERC-3009 Settlement -> Sponsorship & Execution
  const runSimulation = async (type, details) => {
    if (simActive) return;
    setSimActive(true);
    setSimStep(1);
    setSimSuccess(false);
    setSimTxHash("");
    setSimError("");
    
    const logs = [];
    const addLog = (msg) => {
      logs.push({ time: new Date().toLocaleTimeString(), text: msg });
      setSimLogs([...logs]);
    };

    // ── Real On-Chain UGF Path ────────────────────────────────────────────────
    if (wallet.account && wallet.isRightChain) {
      addLog(`[UGF Client] Initializing REAL on-chain transaction for ${type} (${details})...`);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        let recipientAddress = CONTRACT_ADDRESS;
        let transferVal = "1";
        
        if (type === "Donation") {
          recipientAddress = CONTRACT_ADDRESS;
          transferVal = donationAmount || "10";
        } else if (type === "Checkout") {
          recipientAddress = CONTRACT_ADDRESS;
          transferVal = "15";
        } else if (type === "Transfer") {
          if (!transferRecipient || !transferAmount) {
            throw new Error("Recipient address and amount must be provided.");
          }
          recipientAddress = transferRecipient;
          transferVal = transferAmount;
        } else if (type === "Reward Claim") {
          recipientAddress = wallet.account;
          transferVal = "1";
        } else if (type === "Agent Pre-Authorization") {
          recipientAddress = wallet.account;
          transferVal = "0.01";
        }

        addLog(`[Step 1/4: Auth] Requesting EIP-191 signature for wallet session login...`);
        
        const realTxHash = await executeGaslessTokenTransfer(
          signer,
          recipientAddress,
          transferVal,
          (step) => {
            setSimStep(step);
            if (step === 1) {
              addLog(`[Step 1/4: Auth] Requesting EIP-191 signature...`);
            } else if (step === 2) {
              addLog(`[Step 1/4: Auth] Authentication successful! JWT Session established.`);
              addLog(`[Step 2/4: Quote] Encoding transfer payload on TYI token contract...`);
              addLog(`[Step 2/4: Quote] Retrieving gas quote from UGF testnet oracle...`);
            } else if (step === 3) {
              addLog(`[Step 2/4: Quote] Gas Quoted! Sponsorship covers 100% of native network fee.`);
              addLog(`[Step 3/4: Settle] Requesting ERC-3009 transfer signature for settlement...`);
            } else if (step === 4) {
              addLog(`[Step 3/4: Settle] Settlement signature verified! zero native ETH required.`);
              addLog(`[Step 4/4: Execute] Submitting transaction to Base Sepolia node...`);
            }
          }
        );
        
        setSimTxHash(realTxHash);
        addLog(`[Step 4/4: Execute] Real transaction successfully mined on-chain!`);
        addLog(`[Tx Hash] ${realTxHash}`);
        setSimSuccess(true);
        setSimStep(5);
        setSimActive(false);
        
        if (type === "Checkout") {
          setPaymentCompleted(true);
        }
        
        // Refresh collection balance
        collection.refresh(wallet.account);
      } catch (err) {
        const errMsg = err?.message ?? String(err);
        const shortMsg = errMsg.length > 80 ? errMsg.slice(0, 80) + "..." : errMsg;
        addLog(`[UGF Error] Transaction failed: ${shortMsg}`);
        setSimError(errMsg === "NO_MOCK_USD" || errMsg.includes("NO_MOCK_USD") ? "NO_MOCK_USD" : shortMsg);
        setSimActive(false);
        setSimStep(0);
      }
      return;
    }

    // ── Simulated Fallback Path ────────────────────────────────────────────────
    addLog(`[UGF Client] Initializing gasless session for ${type} (${details})...`);
    await new Promise(r => setTimeout(r, 600));
    
    setSimStep(1);
    addLog(`[Step 1/4: Auth] Requesting EIP-191 signature for wallet session login...`);
    await new Promise(r => setTimeout(r, 800));
    addLog(`[Step 1/4: Auth] Signature received from provider. Exchanging for UGF JWT...`);
    await new Promise(r => setTimeout(r, 600));
    addLog(`[Step 1/4: Auth] Authentication successful! Session valid for 60 minutes.`);
    
    await new Promise(r => setTimeout(r, 400));
    setSimStep(2);
    addLog(`[Step 2/4: Quote] Encoding EVM calldata for transaction payload...`);
    await new Promise(r => setTimeout(r, 600));
    addLog(`[Step 2/4: Quote] Requested quote from UGF testnet oracle.`);
    addLog(`[Step 2/4: Quote] Gas Quoted: 0.18 TYI_MOCK_USD (100% sponsored gas).`);
    
    await new Promise(r => setTimeout(r, 400));
    setSimStep(3);
    addLog(`[Step 3/4: Settle] Requesting ERC-3009 transfer signature for 0.18 TYI.`);
    await new Promise(r => setTimeout(r, 800));
    addLog(`[Step 3/4: Settle] Settlement authorization received. Sponsoring 0 ETH gas fee...`);
    
    await new Promise(r => setTimeout(r, 400));
    setSimStep(4);
    addLog(`[Step 4/4: Execute] Submitting transaction to Base Sepolia EVM node...`);
    await new Promise(r => setTimeout(r, 800));
    const randomHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    setSimTxHash(randomHash);
    addLog(`[Step 4/4: Execute] Transaction successfully mined on-chain!`);
    addLog(`[Tx Hash] ${randomHash}`);
    setSimSuccess(true);
    setSimStep(5);
    setSimActive(false);
    
    if (type === "Checkout") {
      setPaymentCompleted(true);
    }
  };

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

        <UGFPlaygroundsSection
          badges={BADGES}
          claimed={collection.claimed}
          isWalletReady={isWalletReady}
          onClaim={handleClaim}
          wallet={wallet}
          isClaiming={isClaiming}
          activeTrack={activeTrack}
          setActiveTrack={setActiveTrack}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          transferRecipient={transferRecipient}
          setTransferRecipient={setTransferRecipient}
          transferAmount={transferAmount}
          setTransferAmount={setTransferAmount}
          simActive={simActive}
          simStep={simStep}
          simLogs={simLogs}
          simSuccess={simSuccess}
          simTxHash={simTxHash}
          simError={simError}
          setSimError={setSimError}
          runSimulation={runSimulation}
          paymentCompleted={paymentCompleted}
          setPaymentCompleted={setPaymentCompleted}
          subscriptionEnabled={subscriptionEnabled}
          setSubscriptionEnabled={setSubscriptionEnabled}
          agentPreauthorized={agentPreauthorized}
          setAgentPreauthorized={setAgentPreauthorized}
          agentLogs={agentLogs}
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
