import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';
import { Shield, Layers } from 'lucide-react';

export function Footer() {
  const repositoryUrl = "https://github.com/khanolkarsujal/GasFree-Badge";
  const tokenTrackerUrl = `https://sepolia.basescan.org/token/${CONTRACT_ADDRESS}`;

  return (
    <footer className="relative z-10 bg-[#030303] pt-12 pb-8 mt-10 border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom,rgba(139,92,246,0.03),transparent_60%)]" />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          
          {/* Left Side: Brand */}
          <div className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-purple-500/40 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Shield className="w-4 h-4 text-purple-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight">GasFreeBadge</span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">UGF Hackathon 2026</span>
            </div>
          </div>

          {/* Right Side: Links */}
          <nav className="flex items-center gap-6 sm:gap-8" aria-label="Footer links">
            <a 
              href={basescanAddress(CONTRACT_ADDRESS)} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-all duration-200 relative group/link"
            >
              Contract
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover/link:w-full" />
            </a>
            <a 
              href="https://universalgasframework.com/docs/overview" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-all duration-200 relative group/link"
            >
              UGF Docs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover/link:w-full" />
            </a>
            <a 
              href={tokenTrackerUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-all duration-200 relative group/link"
            >
              Token Explorer
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover/link:w-full" />
            </a>
            <a 
              href={repositoryUrl} 
              target="_blank" 
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="text-slate-400 hover:text-white transition-all duration-200 transform hover:scale-110 ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-6"></div>

        {/* Bottom Row */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-purple-400/80 group cursor-default">
            <Layers className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-purple-300">Built on Base</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
