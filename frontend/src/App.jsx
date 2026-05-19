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
import { executeGaslessClaim, executeGaslessTokenTransfer, getTYIBalance } from "@/services/ugfService";
import { sessionStore } from "@/services/sessionStore";
import { BADGES } from "@/lib/constants";
import { CONTRACT_ADDRESS } from "@/contractConfig";
import { Header, Footer, HeroSection, MyCollection, HowItWorks, CallToAction, ClaimModal, Features, BadgeCard } from "@/components";
import { basescanAddress, copyToClipboard } from "@/lib/utils";

const isDeployed = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";


function Stat({ label, value, sub, divider }) {
  return (
    <div className={`p-4 ${divider ? "border-l border-white/10" : ""}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-semibold">{value}</div>
      {sub && <div className="mt-1 text-[10px] text-muted-foreground">{sub}</div>}
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
  wallet,
  agentWalletAddress,
  agentBalance,
  handleOpenAgentModal,
  ensureWalletConnected,
}) {
  const handleDonate = async () => {
    if (!(await ensureWalletConnected())) return;
    runSimulation("Donation", `${donationAmount} TYI`);
  };

  const handleCheckout = async () => {
    if (!(await ensureWalletConnected())) return;
    runSimulation("Checkout", "$15.00 Mock USD");
  };

  const handleToggleSubscription = async () => {
    if (!(await ensureWalletConnected())) return;
    if (subscriptionEnabled) {
      setSubscriptionEnabled(false);
    } else {
      if (!agentWalletAddress) {
        handleOpenAgentModal("subscription");
      } else {
        await runSimulation("Subscription Permit", "$9.99/mo");
        setSubscriptionEnabled(true);
      }
    }
  };

  let donateBtnText = `Donate ${donationAmount || 0} TYI Gaslessly`;
  if (!wallet.account) donateBtnText = "Connect Wallet";
  else if (!wallet.isRightChain) donateBtnText = "Switch to Base Sepolia";
  else if (simActive) donateBtnText = "Executing Transaction...";

  let checkoutBtnText = "Complete Gasless Checkout";
  if (paymentCompleted) checkoutBtnText = "License Purchased!";
  else if (!wallet.account) checkoutBtnText = "Connect Wallet";
  else if (!wallet.isRightChain) checkoutBtnText = "Switch to Base Sepolia";
  else if (simActive) checkoutBtnText = "Checking out...";

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
            onClick={handleDonate}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {donateBtnText}
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
            disabled={simActive || paymentCompleted}
            onClick={handleCheckout}
            className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
              paymentCompleted
                ? "bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 cursor-default"
                : "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            }`}
          >
            {checkoutBtnText}
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
                onClick={handleToggleSubscription}
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
                <span className="text-emerald-400 font-semibold">✓ Gasless Auto-Billing Active (Debits Session Wallet)</span>
              ) : (
                "Authorize recurring debit via Session Wallet"
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
  wallet,
  agentWalletAddress,
  agentBalance,
  handleOpenAgentModal,
  handleDeactivateAgent,
  ensureWalletConnected,
}) {
  const handleSendTokens = async () => {
    if (!(await ensureWalletConnected())) return;
    runSimulation("Transfer", `${transferAmount} TYI to ${transferRecipient.slice(0, 6)}...`);
  };

  const handleClaimRewards = async () => {
    if (!(await ensureWalletConnected())) return;
    runSimulation("Reward Claim", "100 XP Rewards");
  };

  const handleToggleAgent = async () => {
    if (!(await ensureWalletConnected())) return;
    if (agentPreauthorized) {
      await handleDeactivateAgent();
    } else {
      handleOpenAgentModal("agent");
    }
  };

  let sendBtnText = "Send Tokens Gaslessly";
  if (!wallet.account) sendBtnText = "Connect Wallet";
  else if (!wallet.isRightChain) sendBtnText = "Switch Network";
  else if (simActive) sendBtnText = "Sending...";

  let claimBtnText = "Claim 100 XP Gaslessly";
  if (!wallet.account) claimBtnText = "Connect Wallet";
  else if (!wallet.isRightChain) claimBtnText = "Switch Network";
  else if (simActive) claimBtnText = "Claiming...";

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
            onClick={handleSendTokens}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendBtnText}
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
            onClick={handleClaimRewards}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {claimBtnText}
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
                onClick={handleToggleAgent}
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

            {agentPreauthorized && agentWalletAddress && (
              <div className="mt-4 p-3 rounded-xl border border-white/5 bg-black/40 space-y-1.5 text-[10px] font-mono">
                <div className="flex justify-between items-center text-white/50">
                  <span>Agent Address:</span>
                  <span className="text-white select-all">{agentWalletAddress.slice(0, 8)}...{agentWalletAddress.slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Agent Balance:</span>
                  <span className="text-emerald-400 font-bold">{agentBalance.toFixed(4)} TYI</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Relay Gas Fee:</span>
                  <span className="text-emerald-400">0.00 ETH (UGF Sponsored)</span>
                </div>
                <button
                  onClick={() => handleOpenAgentModal("agent")}
                  className="w-full mt-2 py-1.5 rounded bg-white/5 text-white hover:bg-white/10 border border-white/5 text-[9px] font-sans font-bold transition-all"
                >
                  Add Authorization Funds
                </button>
              </div>
            )}
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
              <div key={i} className="flex flex-wrap gap-x-2.5 items-center">
                <span className="text-indigo-400 font-semibold">[{log.time}]</span>
                <span>{log.text}</span>
                {log.txHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${log.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[oklch(0.75_0.18_295)] hover:underline flex items-center gap-0.5 font-semibold ml-1"
                  >
                    Basescan <ExternalLink className="h-3 w-3 inline" />
                  </a>
                )}
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
  // Agentic additions
  agentWalletAddress,
  agentBalance,
  handleOpenAgentModal,
  handleDeactivateAgent,
  ensureWalletConnected,
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
                  const badgeTypeMap = { 0: "explorer", 1: "builder", 2: "pioneer" };
                  const isClaimed = isWalletReady && claimed.some(c => badgeTypeMap[c.badgeType] === badge.id);
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      isClaimed={isClaimed}
                      isWalletReady={isWalletReady}
                      labelOverride={
                        !wallet.isRightChain
                          ? "Switch Network"
                          : isClaiming
                          ? "Claiming..."
                          : "Claim Badge"
                      }
                      disabled={isClaiming || !isDeployed}
                      onClaim={
                        !wallet.account
                          ? wallet.connect
                          : !wallet.isRightChain
                          ? wallet.switchToBaseSepolia
                          : () => onClaim(badge)
                      }
                    />
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
              wallet={wallet}
              agentWalletAddress={agentWalletAddress}
              agentBalance={agentBalance}
              handleOpenAgentModal={handleOpenAgentModal}
              ensureWalletConnected={ensureWalletConnected}
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
              wallet={wallet}
              agentWalletAddress={agentWalletAddress}
              agentBalance={agentBalance}
              handleOpenAgentModal={handleOpenAgentModal}
              handleDeactivateAgent={handleDeactivateAgent}
              ensureWalletConnected={ensureWalletConnected}
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
            href="https://universalgasframework.com/docs/overview"
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
            href="https://universalgasframework.com/docs/overview"
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
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Ephemeral Agent Session states
  const [agentWalletAddress, setAgentWalletAddress] = useState("");
  const [agentBalance, setAgentBalance] = useState(0);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateBalance, setDeactivateBalance] = useState(0);
  const [pendingAction, setPendingAction] = useState(""); // "agent" or "subscription"

  // Modal funding states
  const [isFundingAgent, setIsFundingAgent] = useState(false);
  const [fundingStep, setFundingStep] = useState(0);
  const [fundingLogs, setFundingLogs] = useState([]);
  const [fundingSuccess, setFundingSuccess] = useState(false);
  const [fundingTxHash, setFundingTxHash] = useState("");
  const [fundingError, setFundingError] = useState("");

  const getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider("https://sepolia.base.org");
  };

  const ensureWalletConnected = async () => {
    if (!wallet.account) {
      await wallet.connect();
      return false;
    }
    if (!wallet.isRightChain) {
      await wallet.switchToBaseSepolia();
      return false;
    }
    return true;
  };

  useEffect(() => {
    collection.refresh(wallet.account);
    const id = setInterval(() => collection.refresh(wallet.account), 30_000);
    return () => clearInterval(id);
  }, [wallet.account]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Effect for rolling autonomous AI agent real transactions
  useEffect(() => {
    if (!agentPreauthorized || !agentWalletAddress) {
      setAgentLogs([]);
      return;
    }

    const provider = getProvider();
    const agentSigner = sessionStore.getSigner(provider);
    if (!agentSigner) return;

    const initialLogs = [
      { time: new Date().toLocaleTimeString(), text: `[Agent] Autonomous agent initialized. Address: ${agentWalletAddress.slice(0, 6)}...${agentWalletAddress.slice(-4)}` },
      { time: new Date().toLocaleTimeString(), text: "[Agent] Pre-authorized session active. Checking balance..." }
    ];
    setAgentLogs(initialLogs);

    getTYIBalance(provider, agentWalletAddress).then(bal => {
      setAgentBalance(bal ?? 0);
      setAgentLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), text: `[Agent] Current balance: ${bal !== null ? bal.toFixed(4) : "0"} TYI.` }
      ]);
    });

    const agentActions = [
      {
        desc: "DeFi Yield Router rebalance",
        amount: "0.02",
        to: CONTRACT_ADDRESS,
        logStart: "Scanning Base Sepolia yield vaults...",
        logPreTx: "Yield opportunity found! Routing 0.02 TYI to GasFreeBadge Vault...",
        logSuccess: "Yield routed successfully! Harvested rewards on-chain."
      },
      {
        desc: "Arbitrage Execution",
        amount: "0.01",
        to: CONTRACT_ADDRESS,
        logStart: "Sensed 0.5% price discrepancy on mock Uniswap pair...",
        logPreTx: "Executing gasless arbitrage trade for 0.01 TYI...",
        logSuccess: "Arbitrage completed. Captured +0.03 TYI on-chain yield."
      },
      {
        desc: "Liquidity Re-allocation",
        amount: "0.03",
        to: CONTRACT_ADDRESS,
        logStart: "Analyzing stablecoin lending pool rates on Base Sepolia...",
        logPreTx: "Re-allocating 0.03 TYI to high-yield pool...",
        logSuccess: "Collateral optimized. Yield generation active."
      }
    ];

    let counter = 0;
    const interval = setInterval(async () => {
      const action = agentActions[counter % agentActions.length];
      counter++;

      setAgentLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), text: `[Agent] ${action.logStart}` },
        { time: new Date().toLocaleTimeString(), text: `[Agent] ${action.logPreTx}` }
      ].slice(-10));

      try {
        if (!isTabVisible) return;
        const bal = await getTYIBalance(provider, agentWalletAddress);
        setAgentBalance(bal ?? 0);
        
        if (bal === null || bal < parseFloat(action.amount)) {
          setAgentLogs(prev => [
            ...prev,
            { time: new Date().toLocaleTimeString(), text: `[Agent Error] Insufficient balance (${bal !== null ? bal.toFixed(4) : "0"} TYI). Please fund the agent.` }
          ].slice(-10));
          return;
        }

        const activeSigner = sessionStore.getSigner(provider);
        if (!activeSigner) return;

        const txHash = await executeGaslessTokenTransfer(
          activeSigner,
          action.to,
          action.amount,
          (step) => {
            if (step === 1) {
              setAgentLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `[Agent] Auth: Signing EIP-191 session...` }].slice(-10));
            } else if (step === 3) {
              setAgentLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `[Agent] Settle: Signing ERC-3009 transfer...` }].slice(-10));
            } else if (step === 4) {
              setAgentLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `[Agent] Execute: Submitting to Base Sepolia...` }].slice(-10));
            }
          }
        );

        setAgentLogs(prev => [
          ...prev,
          { 
            time: new Date().toLocaleTimeString(), 
            text: `[Agent Success] ${action.logSuccess} Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
            txHash
          }
        ].slice(-10));

        const newBal = await getTYIBalance(provider, agentWalletAddress);
        setAgentBalance(newBal ?? 0);
        collection.refresh(wallet.account);
      } catch (err) {
        console.error("Agent automation error:", err);
        setAgentLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), text: `[Agent Error] Failed execution: ${err.message || err}` }
        ].slice(-10));
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [agentPreauthorized, agentWalletAddress, isTabVisible]);

  // Effect for automated subscription billing cycles
  useEffect(() => {
    if (!subscriptionEnabled || !agentWalletAddress) return;

    const provider = getProvider();

    const billingInterval = setInterval(async () => {
      if (!isTabVisible) return;
      const activeSigner = sessionStore.getSigner(provider);
      if (!activeSigner) return;

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

      addLog(`[Subscription Relayer] Automated renewal cycle triggered for API Hub Plan ($9.99/mo)...`);
      addLog(`[Subscription Relayer] Debiting 0.05 TYI (scaled down for demo) from agent session wallet...`);

      try {
        const bal = await getTYIBalance(provider, agentWalletAddress);
        if (bal === null || bal < 0.05) {
          throw new Error("Pre-authorized Agent Wallet has insufficient balance to cover subscription renewal.");
        }

        const txHash = await executeGaslessTokenTransfer(
          activeSigner,
          CONTRACT_ADDRESS,
          "0.05",
          (step) => {
            setSimStep(step);
            if (step === 1) {
              addLog(`[Step 1/4: Auth] Authenticating Agent Wallet session...`);
            } else if (step === 2) {
              addLog(`[Step 2/4: Quote] Encoding transfer and requesting oracle gas quote...`);
            } else if (step === 3) {
              addLog(`[Step 3/4: Settle] Signing ERC-3009 settlement from Agent Wallet...`);
            } else if (step === 4) {
              addLog(`[Step 4/4: Execute] Broad-casting tx to Base Sepolia node...`);
            }
          }
        );

        setSimTxHash(txHash);
        addLog(`[Step 4/4: Execute] Subscription renewal charge successfully mined on-chain!`);
        addLog(`[Tx Hash] ${txHash}`);
        setSimSuccess(true);
        setSimStep(5);
        setSimActive(false);

        const newBal = await getTYIBalance(provider, agentWalletAddress);
        setAgentBalance(newBal ?? 0);
        collection.refresh(wallet.account);
      } catch (err) {
        console.error("Subscription renewal error:", err);
        addLog(`[Subscription Error] Renewal charge failed: ${err.message || err}`);
        setSimError(err.message || String(err));
        setSimActive(false);
        setSimStep(0);
      }
    }, 45000);

    return () => clearInterval(billingInterval);
  }, [subscriptionEnabled, agentWalletAddress, isTabVisible]);

  const handleDeactivateAgent = async () => {
    const provider = getProvider();
    const bal = await getTYIBalance(provider, agentWalletAddress);
    if (bal && bal > 0.01) {
      setDeactivateBalance(bal);
      setShowDeactivateModal(true);
    } else {
      setAgentPreauthorized(false);
      setAgentWalletAddress("");
      setAgentBalance(0);
      sessionStore.clear();
    }
  };

  const handleConfirmDeactivate = async (withdraw) => {
    setShowDeactivateModal(false);
    
    if (withdraw && deactivateBalance > 0.01) {
      const provider = getProvider();
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

      addLog(`[Agent Session] Initiating refund of ${deactivateBalance.toFixed(4)} TYI back to user wallet...`);
      try {
        const activeSigner = sessionStore.getSigner(provider);
        if (!activeSigner) throw new Error("Agent session wallet not found");

        const txHash = await executeGaslessTokenTransfer(
          activeSigner,
          wallet.account,
          deactivateBalance.toString(),
          (step) => {
            setSimStep(step);
            if (step === 1) {
              addLog(`[Step 1/4: Auth] Authenticating Agent Wallet...`);
            } else if (step === 2) {
              addLog(`[Step 2/4: Quote] Encoding transfer and requesting quote...`);
            } else if (step === 3) {
              addLog(`[Step 3/4: Settle] Signing settlement from Agent Wallet...`);
            } else if (step === 4) {
              addLog(`[Step 4/4: Execute] Broadcasting refund to Base Sepolia...`);
            }
          }
        );

        setSimTxHash(txHash);
        addLog(`[Step 4/4: Execute] Refund transaction mined on-chain!`);
        addLog(`[Tx Hash] ${txHash}`);
        setSimSuccess(true);
        setSimStep(5);
        setSimActive(false);

        setAgentPreauthorized(false);
        setAgentWalletAddress("");
        setAgentBalance(0);
        sessionStore.clear();
        collection.refresh(wallet.account);
      } catch (err) {
        console.error("Refund error:", err);
        addLog(`[Agent Error] Refund failed: ${err.message || err}`);
        setSimError(err.message || String(err));
        setSimActive(false);
        setSimStep(0);
      }
    } else {
      setAgentPreauthorized(false);
      setAgentWalletAddress("");
      setAgentBalance(0);
      sessionStore.clear();
    }
  };

  const handleOpenAgentModal = (action = "agent") => {
    setPendingAction(action);
    setFundingSuccess(false);
    setFundingTxHash("");
    setFundingError("");
    setFundingLogs([]);
    setFundingStep(0);
    
    const provider = getProvider();
    if (!sessionStore.isActive()) {
      const addr = sessionStore.create(provider);
      setAgentWalletAddress(addr);
    }
    
    setShowAgentModal(true);
  };

  const handleConfirmFundAgent = async (amount) => {
    setIsFundingAgent(true);
    setFundingStep(1);
    setFundingSuccess(false);
    setFundingTxHash("");
    setFundingError("");
    
    const logs = [];
    const addLog = (msg) => {
      logs.push({ time: new Date().toLocaleTimeString(), text: msg });
      setFundingLogs([...logs]);
    };

    addLog(`[Agent Session] Generating ephemeral Agent keypair...`);
    const provider = getProvider();
    
    let targetAddress = agentWalletAddress;
    if (!targetAddress) {
      targetAddress = sessionStore.create(provider);
      setAgentWalletAddress(targetAddress);
    }
    
    addLog(`[Agent Session] Initializing UGF authorization transfer to agent address: ${targetAddress}...`);

    try {
      const signer = await provider.getSigner();
      
      const txHash = await executeGaslessTokenTransfer(
        signer,
        targetAddress,
        amount,
        (step) => {
          setFundingStep(step);
          if (step === 1) {
            addLog(`[Step 1/4: Auth] Requesting EIP-191 signature...`);
          } else if (step === 2) {
            addLog(`[Step 2/4: Quote] Encoding transfer and requesting quote...`);
          } else if (step === 3) {
            addLog(`[Step 3/4: Settle] Signing ERC-3009 transfer from your wallet...`);
          } else if (step === 4) {
            addLog(`[Step 4/4: Execute] Submitting transaction to Base Sepolia node...`);
          }
        }
      );

      setFundingTxHash(txHash);
      addLog(`[Step 4/4: Execute] Agent pre-funded successfully!`);
      addLog(`[Tx Hash] ${txHash}`);
      setFundingSuccess(true);
      setFundingStep(5);
      
      setAgentPreauthorized(true);
      setAgentBalance(parseFloat(amount));
      
      if (pendingAction === "subscription") {
        setSubscriptionEnabled(true);
      }
      
      collection.refresh(wallet.account);
    } catch (err) {
      console.error("Agent funding error:", err);
      const errMsg = err?.message ?? String(err);
      const shortMsg = errMsg.length > 80 ? errMsg.slice(0, 80) + "..." : errMsg;
      addLog(`[Agent Error] Funding failed: ${shortMsg}`);
      setFundingError(errMsg === "NO_MOCK_USD" || errMsg.includes("NO_MOCK_USD") ? "NO_MOCK_USD" : shortMsg);
      setFundingStep(0);
    } finally {
      setIsFundingAgent(false);
    }
  };

  const handleAgentModalClose = () => {
    if (isFundingAgent) return;
    setShowAgentModal(false);
    setPendingAction("");
  };

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
        } else if (type === "Subscription Permit") {
          recipientAddress = CONTRACT_ADDRESS;
          transferVal = "5"; // 5 TYI setup
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
      
      let badgeType = 0;
      if (badge.id === "builder") badgeType = 1;
      else if (badge.id === "pioneer") badgeType = 2;

      const hash = await executeGaslessClaim(signer, badgeType, setActiveStep);
      setTxHash(hash);
      setActiveStep(5);
      await collection.refresh(wallet.account);
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
      <Header account={wallet.account} isRightChain={wallet.isRightChain} onConnect={wallet.connect} />
      
      <main>
        <HeroSection
          stats={collection.stats}
          onConnect={wallet.connect}
        />

        {isWalletReady && collection.claimed.length > 0 && (
          <div className="mx-auto max-w-[1000px] px-6 mt-12">
            <h3 className="text-xl font-bold text-white mb-6">Collected Badges</h3>
            <MyCollection claimed={collection.claimed} />
          </div>
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
          
          agentWalletAddress={agentWalletAddress}
          agentBalance={agentBalance}
          handleOpenAgentModal={handleOpenAgentModal}
          handleDeactivateAgent={handleDeactivateAgent}
          ensureWalletConnected={ensureWalletConnected}
        />

        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Tech wallet={wallet} />
        <CallToAction onConnect={wallet.connect} isWalletReady={!!wallet.account} />
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

      <AgentSessionModal
        isOpen={showAgentModal}
        onClose={handleAgentModalClose}
        wallet={wallet}
        onConfirmFund={handleConfirmFundAgent}
        isFunding={isFundingAgent}
        fundingStep={fundingStep}
        fundingLogs={fundingLogs}
        fundingSuccess={fundingSuccess}
        fundingTxHash={fundingTxHash}
        fundingError={fundingError}
        setFundingError={setFundingError}
        agentWalletAddress={agentWalletAddress}
      />

      <DeactivateConfirmModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        balance={deactivateBalance}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}

function AgentSessionModal({
  isOpen,
  onClose,
  wallet,
  onConfirmFund,
  isFunding,
  fundingStep,
  fundingLogs,
  fundingSuccess,
  fundingTxHash,
  fundingError,
  setFundingError,
  agentWalletAddress,
}) {
  const [fundAmount, setFundAmount] = useState("5");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-black/90 p-6 md:p-8 shadow-2xl"
          style={{ background: "var(--gradient-card)" }}
        >
          {/* Neon radial backdrop */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-[oklch(0.75_0.18_295)]" />
              <h3 className="font-heading text-lg font-bold text-white">Pre-Authorize AI Agent Session</h3>
            </div>
            <button
              onClick={onClose}
              disabled={isFunding}
              className="text-muted-foreground hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {!fundingSuccess ? (
            <div className="relative z-10 space-y-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                To enable autonomous gasless transactions for the AI Agent (and recurring billing for the Subscription), we will create a secure, ephemeral session wallet in your browser. Pre-authorize the session by funding it with TYI tokens.
              </p>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-white/55 uppercase tracking-wider">Generated Session Wallet</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-white">{agentWalletAddress}</span>
                    <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">Active Session</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider mb-2 block">
                  Select Authorization Limit (TYI)
                </label>
                <div className="flex gap-2">
                  {["2", "5", "10"].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFundAmount(val)}
                      disabled={isFunding}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        fundAmount === val
                          ? "bg-white text-black border-white"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {val} TYI
                    </button>
                  ))}
                </div>
              </div>

              {isFunding && (
                <div className="rounded-2xl border border-white/5 bg-black/40 p-4 font-mono text-[11px] text-white/70 space-y-1 max-h-[120px] overflow-y-auto">
                  {fundingLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-indigo-400">[{log.time}]</span>
                      <span className={log.text.includes("Success") || log.text.includes("successful") ? "text-emerald-400" : log.text.includes("failed") ? "text-red-400" : ""}>{log.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {fundingError && (
                <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/10 text-red-400 text-xs leading-relaxed">
                  {fundingError === "NO_MOCK_USD" 
                    ? "Insufficient Mock USD (TYI) balance. Please claim from the faucet first."
                    : fundingError}
                </div>
              )}

              <button
                disabled={isFunding}
                onClick={() => onConfirmFund(fundAmount)}
                className="w-full rounded-xl py-3 text-xs font-bold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFunding ? `Authorizing (Step ${fundingStep}/4)...` : `Approve & Pre-Authorize Agent`}
              </button>
            </div>
          ) : (
            <div className="relative z-10 text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white">Agent Pre-Authorized!</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  The ephemeral session wallet has been funded with {fundAmount} TYI. The AI Agent will now trade autonomously and pay zero gas.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 max-w-sm mx-auto flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Transaction Hash:</span>
                  <span className="font-mono text-indigo-300 text-[10px] truncate max-w-[180px]">{fundingTxHash}</span>
                </div>
                <a
                  href={`https://sepolia.basescan.org/tx/${fundingTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs font-bold text-white hover:underline inline-flex items-center justify-center gap-1"
                >
                  Verify on BaseScan <ExternalLink className="h-3 w-3" />
                </a>
              </div>

            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DeactivateConfirmModal({
  isOpen,
  onClose,
  balance,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08),transparent_70%)]" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <h3 className="font-heading text-base font-bold text-white">Confirm Deauthorization</h3>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-white transition-colors text-base"
            >
              ✕
            </button>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are deauthorizing the active AI Agent session. This will suspend autonomous yield rebalancing and recurring subscription renewals.
            </p>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Agent Address:</span>
                <span className="font-mono text-white text-[11px]">Active Session</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="text-emerald-400 font-bold">{balance.toFixed(4)} TYI</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => onConfirm(true)}
                className="w-full rounded-xl py-2.5 text-xs font-bold bg-white text-black hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all cursor-pointer font-sans"
              >
                Withdraw Balance & Deauthorize
              </button>
              <button
                onClick={() => onConfirm(false)}
                className="w-full rounded-xl py-2.5 text-xs font-semibold border border-red-500/20 bg-red-950/10 text-red-400 hover:bg-red-950/20 transition-all cursor-pointer font-sans"
              >
                Deauthorize Without Refund
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl py-2.5 text-xs font-medium border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 transition-all cursor-pointer font-sans"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
