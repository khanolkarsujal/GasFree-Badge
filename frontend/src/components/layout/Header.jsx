import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';
import { Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ account, isRightChain, onConnect }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-[80px] bg-[#050505]/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      
      {/* Left — Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-[#a855f7]" />
        </div>
        <span className="text-[1.05rem] font-bold tracking-tight text-white">
          GasFreeBadge
        </span>
      </div>

      {/* Right — Links & Wallet */}
      <div className="flex items-center gap-8">
        <nav className="hidden sm:flex items-center gap-6">
          <a href={basescanAddress(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer"
            className="text-[13px] font-medium text-[#8b949e] hover:text-white transition-colors">
            Contract
          </a>
          <a href="https://universalgasframework.com/docs/overview" target="_blank" rel="noreferrer"
            className="text-[13px] font-medium text-[#8b949e] hover:text-white transition-colors">
            UGF Docs
          </a>
        </nav>
        
        {(!account || !isRightChain) ? (
          <button 
            onClick={onConnect}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-gray-200 text-black text-[13px] font-bold transition-colors shadow-sm"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#13141a] border border-white/10 text-white text-[13px] font-bold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}
      </div>

    </header>
  );
}
