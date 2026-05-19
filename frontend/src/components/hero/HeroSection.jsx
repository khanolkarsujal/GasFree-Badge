import { useState } from 'react';
import { CONTRACT_ADDRESS } from '../../contractConfig';
import { Copy, ExternalLink, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Raycast-inspired asymmetric hero — content left, floating badge right.
 * Stripe-style metric strip beneath.
 */
export function HeroSection({ stats }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-2 pb-0">
      {/* ── Two-column hero (Raycast layout) ── */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-16">

        {/* Left — content */}
        <div className="flex flex-col gap-5 max-w-[520px]">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-[6px] bg-[#6366f1]/[0.08] border border-[#6366f1]/[0.2] text-[#818cf8] text-[0.68rem] font-semibold uppercase tracking-[0.06em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] flex-shrink-0" aria-hidden />
            Gasless NFT · UGF Hackathon
          </div>

          {/* Headline — Linear font weight */}
          <h1 className="text-[clamp(2.1rem,4.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#f1f5f9]">
            On-Chain Credentials<br />
            <span className="gradient-text">Without Gas Friction</span>
          </h1>

          {/* Value prop */}
          <p className="text-[#64748b] text-[0.95rem] leading-[1.72] max-w-[420px]">
            Claim a verifiable NFT badge on Base Sepolia — no ETH in your wallet required.
            Gas is settled in TYI Mock USD via{' '}
            <a href="https://universalgasframework.com" target="_blank" rel="noreferrer"
              className="text-[#818cf8] no-underline hover:text-[#60a5fa] transition-colors">
              Universal Gas Framework
            </a>
            .
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.73rem] text-[#3d4f66]">
            <span>No paymasters</span>
            <span className="text-[#1e293b]">·</span>
            <span>No bundlers</span>
            <span className="text-[#1e293b]">·</span>
            <span>No ERC-4337</span>
            <span className="text-[#1e293b]">·</span>
            <span>Zero ETH in wallet</span>
          </div>

          {/* Contract address */}
          <div className="flex items-center gap-2.5 self-start px-3 py-2 rounded-[8px] bg-[#0e1520] border border-white/[0.07]">
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-[.12em]">Contract</span>
            <div className="flex items-center gap-1.5">
              <span className="mono text-[0.75rem] text-[#818cf8]">
                {CONTRACT_ADDRESS.slice(0, 10)}…{CONTRACT_ADDRESS.slice(-8)}
              </span>
              
              <div className="relative flex items-center gap-1 ml-1">
                <button type="button" onClick={handleCopy} aria-label="Copy contract address" className="p-1 hover:text-white text-slate-500 transition-colors focus:outline-none">
                  <Copy className="w-3.5 h-3.5" />
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
                </button>
                <a
                  href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`}
                  target="_blank" rel="noreferrer"
                  className="p-1 hover:text-white text-slate-500 transition-colors"
                  aria-label="View on BaseScan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right — animated SVG badge */}
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto mt-8 md:mt-0 relative">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            {/* Outer dashed orbit ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30 animate-spin-slow" />
            
            {/* Hexagon Shape */}
            <div className="relative z-10 w-[96px] h-[96px] flex items-center justify-center animate-float">
              {/* Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/40 blur-xl rounded-full" />
              
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <defs>
                  <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 3L93.301 28V72L50 97L6.699 72V28L50 3Z"
                  fill="url(#hexGrad)"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                />
                <text x="50" y="60" fontSize="38" textAnchor="middle" fill="white">🚀</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stripe-style trust signal strip ── */}
      <div className="mt-14 flex flex-col sm:flex-row items-center border-t border-b border-white/[0.06] py-6 gap-6 sm:gap-0">
        
        {/* Star Stat: 0 ETH */}
        <div className="flex flex-col gap-1 w-full sm:w-auto px-6 border-b sm:border-b-0 sm:border-r border-white/10 pb-6 sm:pb-0 text-center sm:text-left">
          <span className="text-[10px] text-green-400 font-extrabold uppercase tracking-[.12em]">
            Gas Cost
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]">
            0 ETH
          </span>
          <span className="text-[0.75rem] text-emerald-500/70 font-medium mt-1">
            Sponsored via TYI Mock USD
          </span>
        </div>

        {/* Secondary Stats Group */}
        <div className="flex flex-1 w-full justify-around sm:justify-start sm:px-8 gap-6 sm:gap-12">
          
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[.12em]">Claimed</span>
            <span className="text-xl font-bold tracking-tight text-indigo-300">
              {stats.minted.toLocaleString()} <span className="text-sm font-medium text-slate-500">/ {stats.total.toLocaleString()}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[.12em]">Remaining</span>
            <span className="text-lg font-semibold tracking-tight text-slate-400">
              {stats.remaining.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[.12em]">Network</span>
            <span className="text-lg font-semibold tracking-tight text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start">
              <Link2 className="w-4 h-4 text-slate-500" /> Base Sepolia
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
