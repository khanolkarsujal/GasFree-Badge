import { CONTRACT_ADDRESS } from '../../contractConfig';
import { basescanAddress } from '../../lib/utils';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ account, isRightChain, onConnect }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-[80px] bg-[#05070c]/90 backdrop-blur-md border-b border-white/5">
      
      {/* Left — Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[8px] bg-[#a855f7] flex items-center justify-center text-[0.85rem] font-bold text-white">
          G
        </div>
        <span className="text-[1.1rem] font-bold tracking-tight text-white">
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
          <a href="https://universalgasframework.com" target="_blank" rel="noreferrer"
            className="text-[13px] font-medium text-[#8b949e] hover:text-white transition-colors">
            UGF Docs
          </a>
        </nav>
        
        {(!account || !isRightChain) ? (
          <button 
            onClick={onConnect}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-white/15 hover:bg-white/5 text-white text-[13px] font-medium transition-colors"
          >
            <Globe className="w-4 h-4 text-[#8b949e]" />
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
