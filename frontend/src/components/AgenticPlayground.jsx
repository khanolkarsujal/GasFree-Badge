import React from "react";
import { Send, Gift, Cpu } from "lucide-react";

export function AgenticPlayground({
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
        <p className="mt-2 text-xs text-[#D9B6FF]/70">
          Deploy smart agents and transfer tokens with zero gas. Enable agentic wallets to execute autonomous transactions gaslessly using pre-authorized session permissions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Token Sender */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-[#6D18FF]/50 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[#D9B6FF] uppercase tracking-wider">Token Sender</span>
              <Send className="h-4 w-4 text-[#D9B6FF]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">Gasless Send Token</h4>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              Transfer mock assets or stablecoins to any recipient address gaslessly. Zero ETH required in either wallet.
            </p>
            
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1.5 block">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full bg-[#05031F]/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#6D18FF]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase mb-1.5 block">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="100"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-[#05031F]/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#6D18FF]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#D9B6FF] uppercase">TYI</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            disabled={simActive || !transferRecipient || !transferAmount}
            onClick={() => runSimulation("Transfer", `${transferAmount} TYI to ${transferRecipient.slice(0, 6)}...`)}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-[#6D18FF] text-white hover:bg-[#D9B6FF] hover:text-black hover:shadow-[0_0_20px_rgba(217,182,255,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {simActive ? "Sending..." : "Send Tokens Gaslessly"}
          </button>
        </div>

        {/* Card 2: Rewards Claim */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-[#6D18FF]/50 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[#D9B6FF] uppercase tracking-wider">Loyalty Rewards</span>
              <Gift className="h-4 w-4 text-[#D9B6FF]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">1-Click Reward Chest</h4>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              Earned loyalty points or rewards? Claim them gaslessly in a single sign action. Ideal for onboarding new users.
            </p>
            
            <div className="mt-5 rounded-2xl border border-dashed border-[#6D18FF]/30 bg-[#6D18FF]/5 p-6 text-center">
              <span className="text-4xl animate-float block">🎁</span>
              <span className="mt-3 block text-xs text-white font-bold">100 Testnet XP Pending</span>
              <span className="text-[10px] text-[#D9B6FF] mt-1 block">Sponsor: Gaslessio</span>
            </div>
          </div>
          
          <button
            disabled={simActive}
            onClick={() => runSimulation("Reward Claim", "100 XP Rewards")}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold bg-white text-black hover:bg-[#D9B6FF] hover:shadow-[0_0_20px_rgba(217,182,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {simActive ? "Claiming..." : "Claim 100 XP Gaslessly"}
          </button>
        </div>

        {/* Card 3: Agentic Wallet */}
        <div className="rounded-3xl border border-white/10 p-6 flex flex-col justify-between bg-white/[0.02] hover:border-[#6D18FF]/50 transition-all shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[#D9B6FF] uppercase tracking-wider">Agent Autonomy</span>
              <Cpu className="h-4 w-4 text-[#D9B6FF]" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white">AI Agent Controller</h4>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              Authorize an AI Agent session. The agent trades or checks yield autonomously, paying zero manual gas fees per trade.
            </p>
            
            <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-[#05031F]/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">DeFi Yield Router Agent</div>
                <div className="text-[10px] text-white/50 mt-0.5">Quota: 50 TYI Daily</div>
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
                  agentPreauthorized ? "bg-[#6D18FF]" : "bg-white/10"
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
          
          <div className="mt-6 text-[11px] border border-white/5 rounded-xl px-3 py-2 bg-[#05031F]/50 flex justify-between items-center leading-none">
            <span className="text-white/60">Agent Active Status:</span>
            <span className={agentPreauthorized ? "text-[#D9B6FF] font-bold" : "text-white/40 font-bold"}>
              {agentPreauthorized ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Activity scrolling terminal inside card footer */}
      {agentPreauthorized && (
        <div className="mt-6 rounded-3xl border border-[#6D18FF]/20 bg-[#05031F]/80 p-5 font-mono text-xs text-white max-w-4xl mx-auto shadow-[0_0_30px_rgba(109,24,255,0.15)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9B6FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9B6FF]"></span>
            </span>
            <span className="font-sans font-bold text-white text-[11px] uppercase tracking-wider">Agentic Live Stream Feed</span>
          </div>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar text-white/70">
            {agentLogs.map((log, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-[#D9B6FF] font-semibold">[{log.time}]</span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
