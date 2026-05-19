import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';
import { Shield, Layers } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#05070c] pt-12 pb-8 mt-10">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          
          {/* Left Side: Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#2e1065] border border-[#7e22ce]/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#a855f7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-white tracking-tight">GasFreeBadge</span>
              <span className="text-[12px] text-[#64748b]">UGF Hackathon 2026</span>
            </div>
          </div>

          {/* Right Side: Links */}
          <nav className="flex items-center gap-8" aria-label="Footer links">
            <a href={basescanAddress(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer"
              className="text-[13px] font-medium text-[#64748b] hover:text-white transition-colors">
              Contract
            </a>
            <a href="https://universalgasframework.com/docs/overview" target="_blank" rel="noreferrer"
              className="text-[13px] font-medium text-[#64748b] hover:text-white transition-colors">
              UGF Docs
            </a>
            <a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer"
              className="text-[13px] font-medium text-[#64748b] hover:text-white transition-colors">
              BaseScan
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="text-[#64748b] hover:text-white transition-colors ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-6"></div>

        {/* Bottom Row */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-[#a855f7]">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase">Built on Base</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
