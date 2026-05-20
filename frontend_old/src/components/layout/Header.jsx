import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';
import { ShieldCheck } from 'lucide-react';

export function Header({ account, isRightChain, onConnect }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-[72px] bg-[#050505]/60 backdrop-blur-md border-b border-white/5 shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
      
      {/* Left — Logo */}
      <div className="flex items-center gap-3 group cursor-default">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center transition-all duration-300 group-hover:border-purple-500/40 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]">
          <ShieldCheck className="w-4.5 h-4.5 text-purple-400 transition-transform duration-300 group-hover:scale-105" />
        </div>
        <span className="text-sm font-extrabold tracking-tight text-white transition-colors group-hover:text-purple-300">
          GasFreeBadge
        </span>
      </div>

      {/* Right — Links & Wallet */}
      <div className="flex items-center gap-6 sm:gap-8">
        <nav className="hidden sm:flex items-center gap-6">
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
        </nav>
        
        {(!account || !isRightChain) ? (
          <button 
            onClick={onConnect}
            className="flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-black text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_1px_10px_rgba(255,255,255,0.1)] cursor-pointer"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white text-xs font-semibold tracking-wide backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        )}
      </div>

    </header>
  );
}
