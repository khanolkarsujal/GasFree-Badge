import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CreditCard, Cpu, ShieldAlert } from "lucide-react";
import { PaymentsPlayground } from "./PaymentsPlayground";
import { AgenticPlayground } from "./AgenticPlayground";
import { UGFTerminal } from "./UGFTerminal";
import { CONTRACT_ADDRESS } from "@/contractConfig";

const isDeployed = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

export function UGFPlaygroundsSection({
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
    <section id="app" className="mx-auto max-w-7xl px-6 py-16 border-t border-white/5 scroll-mt-24">
      {/* Title block */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D9B6FF] bg-[#6D18FF]/10 px-3 py-1.5 rounded-full border border-[#6D18FF]/20">
          Gaslessio Core Playgrounds
        </span>
        <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
          Suggested Developer Tracks
        </h2>
        <p className="mt-4 text-sm text-[#D9B6FF]/70">
          Select a track below to explore the versatility of the Universal Gas Framework (UGF). Try live on-chain operations or interact with instant visual simulations!
        </p>
      </div>

      {/* Modern tab switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 bg-[#05031F]/50 border border-white/10 rounded-2xl max-w-3xl mx-auto mb-12 backdrop-blur-md">
        <button
          onClick={() => setActiveTrack('minting')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTrack === 'minting'
              ? "bg-[#6D18FF] text-white shadow-[0_0_20px_rgba(109,24,255,0.4)] translate-y-[-1px]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Minting & Credentials
        </button>
        <button
          onClick={() => setActiveTrack('payments')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTrack === 'payments'
              ? "bg-[#6D18FF] text-white shadow-[0_0_20px_rgba(109,24,255,0.4)] translate-y-[-1px]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Payments & Checkout
        </button>
        <button
          onClick={() => setActiveTrack('wallet-agents')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            activeTrack === 'wallet-agents'
              ? "bg-[#6D18FF] text-white shadow-[0_0_20px_rgba(109,24,255,0.4)] translate-y-[-1px]"
              : "text-white/60 hover:text-white hover:bg-white/5"
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
                  <p className="mt-2 text-xs text-[#D9B6FF]/70">Verifiable credentials minted directly to your address on Base Sepolia. 100% sponsored by UGF.</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-full border border-[#6D18FF]/20 bg-[#6D18FF]/5 px-4 py-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D9B6FF]" />
                  <span className="text-white/80 font-semibold">
                    {isWalletReady ? `${claimed.length} of ${badges.length} collected` : "Connect wallet to claim"}
                  </span>
                </div>
              </div>

              {!isDeployed && (
                <div className="mb-6 flex items-start gap-4 px-5 py-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-lg backdrop-blur-md">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shrink-0">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-amber-50 tracking-tight">Contract Missing</p>
                    <p className="text-xs text-amber-500/80 mt-1 leading-relaxed">
                      The smart contract is not deployed yet. Please run <code className="font-mono bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-300">npx hardhat run scripts/deploy.js</code>
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
                      className="relative rounded-3xl border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#6D18FF]/50 hover:shadow-[0_20px_50px_rgba(109,24,255,0.15)] hover:-translate-y-1 group/card bg-[#05031F]/50 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D9B6FF]">{badge.rarity} Badge</div>
                            <h3 className="mt-2 font-heading text-xl font-bold text-white">{badge.name}</h3>
                          </div>
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#6D18FF]/20 border border-[#6D18FF]/30 transition-transform duration-300 group-hover/card:scale-110 shadow-[0_0_15px_rgba(109,24,255,0.2)]">
                            <span className="text-lg">{badge.icon}</span>
                          </span>
                        </div>
                        <p className="mt-4 text-xs leading-relaxed text-white/60 min-h-[40px]">{badge.desc}</p>
                        
                        <div className="mt-5 space-y-2">
                          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-2.5 text-xs">
                            <span className="text-white/60">Status</span>
                            <span className={isClaimed ? "text-[#D9B6FF] font-semibold" : "text-white"}>
                              {isClaimed ? "Collected" : "Ready to claim"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-2.5 text-xs">
                            <span className="text-white/60">Gas fee</span>
                            <span className="text-[#D9B6FF] font-semibold">Sponsored</span>
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
                        className={`relative z-10 mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
                          isClaimed
                            ? "bg-[#6D18FF]/20 border border-[#6D18FF]/40 text-[#D9B6FF] cursor-default"
                            : wallet.account && !wallet.isRightChain
                            ? "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                            : "bg-[#6D18FF] text-white hover:bg-[#D9B6FF] hover:text-black hover:shadow-[0_0_20px_rgba(217,182,255,0.4)] cursor-pointer"
                        }`}
                      >
                        {isClaimed
                          ? "Collected"
                          : isClaiming
                          ? "Processing..."
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
