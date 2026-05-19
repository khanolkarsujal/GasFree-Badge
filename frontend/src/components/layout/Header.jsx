import { useState } from 'react';
import { shortenAddress } from '../../lib/utils';
import { CONTRACT_ADDRESS } from '../../contractConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, CheckCircle2, Copy } from 'lucide-react';

export function Header({ account, isRightChain, tyiBalance, onConnect }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-[64px] glass-header">

      {/* Left — Logo */}
      <div className="flex items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-[0.8rem] font-bold text-white shadow-lg shadow-indigo-500/20">
            G
          </div>
          <span className="text-[1.05rem] font-bold tracking-tight text-slate-100">
            GasFree<span className="text-indigo-400">Badge</span>
          </span>
        </motion.div>
      </div>

      {/* Right — status cluster */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        {/* TYI balance */}
        {account && isRightChain && tyiBalance !== null && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mono shadow-inner">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {tyiBalance.toFixed(2)} TYI
          </div>
        )}

        {/* Wallet chip */}
        {account ? (
          <div className="flex items-center rounded-full bg-[#0A0A0A] border border-white/10 text-sm font-semibold text-slate-300 shadow-sm hover:border-white/20 transition-colors group">
            
            {/* Network Section */}
            <div className="hidden md:flex items-center gap-2 pl-4 pr-3 py-1.5">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.6)]" />
              </div>
              <span className="text-[11px] uppercase tracking-widest text-slate-300 font-bold">Base Sepolia</span>
            </div>

            <div className="hidden md:block w-px h-4 bg-white/10" />

            {/* Address Section */}
            <div className="flex items-center gap-2 pl-3 pr-2 py-1.5">
              {/* Avatar Ring */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0A0A0A]" />
              </div>
              
              <span className="mono text-indigo-100 tracking-tight text-[13px]">{shortenAddress(account)}</span>
              
              <div className="relative flex items-center">
                <button type="button" onClick={handleCopy} aria-label="Copy Address" className="p-1 hover:text-white text-slate-500 transition-colors cursor-pointer focus:outline-none">
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
              </div>

              {!isRightChain && <span className="text-amber-500 text-xs ml-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></span>}
              <ChevronDown className="w-4 h-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer mr-1" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-connect-header"
              onClick={onConnect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-slate-900 hover:bg-white text-sm font-bold shadow-lg shadow-white/5 transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4 opacity-80" />
              Connect Wallet
            </motion.button>
          </div>
        )}
      </motion.div>
    </header>
  );
}
