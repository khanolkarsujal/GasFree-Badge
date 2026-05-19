import { useState } from 'react';
import { CONTRACT_ADDRESS } from '../../contractConfig';
import { Copy, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroSection({ stats }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-8 pb-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">

        {/* Left Column — Content */}
        <div className="flex flex-col flex-1 max-w-[560px]">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#13141a] border border-white/10 text-slate-300 text-[10px] font-semibold uppercase tracking-[0.15em] mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" aria-hidden />
            Gasless NFT • UGF Hackathon 2026
          </div>

          {/* Headline */}
          <h1 className="text-[3.25rem] sm:text-[4rem] font-serif leading-[1.05] tracking-tight text-white mb-6">
            On-chain<br />
            credentials<br />
            without gas friction
          </h1>

          {/* Description */}
          <p className="text-[#94a3b8] text-[1.05rem] leading-[1.6] max-w-[480px] mb-8 font-light">
            Claim verifiable NFT badges on Base Sepolia without asking professionals to hold ETH. GasFreeBadge sponsors claims, verifies wallets, and gives teams a cleaner credential workflow.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2.5 rounded-full font-medium text-[0.95rem] transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              Connect Wallet
            </button>
          </div>

          {/* Contract Address */}
          <div className="flex items-center gap-2.5 self-start px-4 py-2 rounded-full bg-[#13141a] border border-white/5 group hover:border-white/10 transition-colors cursor-pointer" onClick={handleCopy}>
            <span className="text-[#475569] text-[10px] font-bold uppercase tracking-[0.15em]">Contract</span>
            <span className="font-mono text-[0.8rem] text-slate-300 tracking-wide">
              {CONTRACT_ADDRESS.slice(0, 8)}…{CONTRACT_ADDRESS.slice(-6)}
            </span>
            <div className="relative">
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
              <AnimatePresence>
                {copied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: -25 }} exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] rounded font-bold shadow-lg pointer-events-none whitespace-nowrap z-50"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Box */}
          <div className="bg-[#0f111a] border border-white/5 rounded-3xl p-6 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x divide-white/5 shadow-xl">
            {/* Gas Cost */}
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-400 font-bold tracking-[0.15em] uppercase mb-1">Gas Cost</span>
              <span className="text-[2.5rem] font-bold text-emerald-400 leading-none tracking-tighter mb-2">0ETH</span>
              <span className="text-[10px] text-[#475569]">Sponsored via TYM Mock USD</span>
            </div>
            
            {/* Claimed */}
            <div className="flex flex-col sm:pl-6">
              <span className="text-[10px] text-[#64748b] font-bold tracking-[0.15em] uppercase mb-3">Claimed</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{stats.minted.toLocaleString()}</span>
                <span className="text-sm font-medium text-[#475569]">/ {stats.total.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Network */}
            <div className="flex flex-col sm:pl-6">
              <span className="text-[10px] text-[#64748b] font-bold tracking-[0.15em] uppercase mb-3">Network</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                <span className="text-[0.95rem] font-bold text-white">Base Sepolia</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column — Credential Preview Card */}
        <div className="flex-shrink-0 w-full lg:w-auto flex justify-center mt-8 lg:mt-0 lg:ml-8 relative">
          
          {/* Outer padding container (The subtle glass border/background) */}
          <div className="p-4 sm:p-6 rounded-[2.5rem] bg-[#171527]/60 border border-[#a855f7]/10 relative z-10 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.05)]">
            
            {/* Inner dark card */}
            <div className="bg-[#0b0d14] rounded-[1.75rem] p-7 sm:p-8 w-full max-w-[400px] shadow-2xl relative">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-[9px] text-[#475569] font-bold tracking-[0.15em] uppercase mb-2">Credential Preview</h4>
                  <h3 className="text-xl sm:text-2xl text-white font-bold tracking-tight">Professional Badge</h3>
                </div>
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-3 mb-6">
                
                {/* Row 1 */}
                <div className="flex justify-between items-center px-5 py-4 rounded-xl border border-white/5 bg-[#12141c]">
                  <span className="text-[0.9rem] text-[#64748b]">Wallet status</span>
                  <span className="text-[0.9rem] text-emerald-400 font-medium">Ready to claim</span>
                </div>
                
                {/* Row 2 */}
                <div className="flex justify-between items-center px-5 py-4 rounded-xl border border-white/5 bg-[#12141c]">
                  <span className="text-[0.9rem] text-[#64748b]">Gas sponsor</span>
                  <span className="text-[0.9rem] text-white font-bold">GasFreeBadge</span>
                </div>
                
                {/* Row 3 */}
                <div className="flex justify-between items-center px-5 py-4 rounded-xl border border-white/5 bg-[#12141c]">
                  <span className="text-[0.9rem] text-[#64748b]">Verification</span>
                  <span className="text-[0.9rem] text-[#e2e8f0] font-medium">BaseScan linked</span>
                </div>
              </div>

              {/* Bottom Box */}
              <div className="bg-[#1c1d2c] border border-white/5 rounded-xl p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#2a2b3d] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#8b949e]" />
                </div>
                <div>
                  <h4 className="text-[0.9rem] text-white font-bold mb-1">Wallet Connection Required</h4>
                  <p className="text-[0.8rem] text-[#64748b] leading-relaxed">
                    Connect your wallet to claim a badge. No ETH is required.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
