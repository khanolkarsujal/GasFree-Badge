import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-[#060a12]">
      <div className="max-w-[1000px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center sm:items-start justify-between flex-wrap gap-6">
        
        {/* Left Side: Brand & Hackathon */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-[4px] bg-gradient-to-br from-[#6366f1] to-[#3b82f6] flex items-center justify-center text-[0.6rem] font-bold text-white flex-shrink-0 mt-0.5"
            aria-hidden>G</div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-slate-300">GasFreeBadge</span>
            <span className="text-[11px] text-gray-600 mt-0.5">UGF Hackathon 2025</span>
          </div>
        </div>

        {/* Right Side: Links & Badges */}
        <div className="flex flex-col sm:items-end gap-4">
          <nav className="flex items-center gap-5" aria-label="Footer links">
            <a href={basescanAddress(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer"
              className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">
              Contract
            </a>
            <a href="https://universalgasframework.com" target="_blank" rel="noreferrer"
              className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">
              UGF Docs
            </a>
            <a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer"
              className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">
              BaseScan
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="GitHub Repository">
              <Github className="w-4 h-4" />
            </a>
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-[#0052FF]/10 border border-[#0052FF]/20 text-[10px] uppercase tracking-wider font-bold text-[#0052FF]">
              <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
              Built on Base
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
