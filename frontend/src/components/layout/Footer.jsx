import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';

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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
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
