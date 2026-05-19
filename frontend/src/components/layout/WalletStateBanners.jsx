import { motion } from 'framer-motion';
import { Wallet, AlertTriangle, AlertCircle, Coins, ChevronRight } from 'lucide-react';

/**
 * Handles wallet-related warnings and calls to action (connecting, switching chains, funding).
 * Extracted from App.jsx to keep the main layout clean and maintainable.
 */
export function WalletStateBanners({ wallet, collection }) {
  if (wallet.account && wallet.isRightChain && !collection.hasNoTYI) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-10 flex flex-col gap-4"
    >
      {/* 1. Connect Wallet Banner */}
      {!wallet.account && (
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 py-5 rounded-2xl bg-[#0e1520]/60 border border-white/5 shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-[0.95rem] font-semibold text-slate-100 tracking-tight">
                Wallet Connection Required
              </h3>
              <p className="text-[0.85rem] text-slate-400 leading-relaxed mt-1">
                {wallet.error === 'no_provider' ? (
                  <>
                    MetaMask was not detected. You'll need it to interact with the blockchain &mdash;{' '}
                    <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium hover:underline underline-offset-4">
                      install it here
                    </a>.
                  </>
                ) : (
                  'Connect your wallet to claim a badge. Gas fees are sponsored, so no ETH is required.'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 relative z-10 sm:ml-4">
            {wallet.error !== 'no_provider' && (
              <a href="https://universalgasframework.com/faucets" target="_blank" rel="noreferrer"
                className="text-[0.85rem] font-medium text-slate-500 hover:text-indigo-400 transition-colors no-underline whitespace-nowrap">
                Need TYI?
              </a>
            )}
            <motion.button
              whileHover={!wallet.loading ? { scale: 1.03 } : {}}
              whileTap={!wallet.loading ? { scale: 0.97 } : {}}
              type="button"
              onClick={wallet.error === 'no_provider' ? () => window.open('https://metamask.io', '_blank') : wallet.connect}
              disabled={wallet.loading}
              className={`relative px-5 py-2.5 rounded-xl text-[0.85rem] font-semibold transition-all duration-300 overflow-hidden flex items-center gap-2 ${wallet.error === 'no_provider'
                  ? 'bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_4px_16px_rgba(99,102,241,0.3)]'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {wallet.error === 'no_provider'
                ? 'Install MetaMask'
                : wallet.loading
                  ? 'Connecting...'
                  : <>Connect Wallet <ChevronRight className="w-4 h-4 opacity-70" /></>}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 2. Wrong Network Banner */}
      {wallet.account && !wallet.isRightChain && (
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="pt-0.5">
              <p className="text-[0.95rem] font-semibold text-amber-50 tracking-tight">
                Unsupported Network
              </p>
              <p className="text-[0.85rem] text-amber-500/80 mt-1">
                Please switch to Base Sepolia to interact with this contract.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={wallet.switchToBaseSepolia}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[0.85rem] font-semibold hover:bg-amber-500/20 hover:text-amber-400 transition-all shadow-sm relative z-10 sm:ml-4"
          >
            Switch Network
          </motion.button>
        </motion.div>
      )}

      {/* 3. Missing TYI Mock USD Banner */}
      {wallet.account && wallet.isRightChain && collection.hasNoTYI && (
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
              <Coins className="w-5 h-5 text-blue-400" />
            </div>
            <div className="pt-0.5">
              <p className="text-[0.95rem] font-semibold text-blue-50 tracking-tight">
                Missing Gas Token
              </p>
              <p className="text-[0.85rem] text-blue-300/70 mt-1">
                You need TYI Mock USD to authorize gas sponsorship. Your ETH balance will not be touched.
              </p>
            </div>
          </div>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://universalgasframework.com/faucets" target="_blank" rel="noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[0.85rem] font-semibold hover:bg-blue-500/20 hover:text-blue-300 transition-all no-underline text-center shadow-sm relative z-10 sm:ml-4"
          >
            Get Free TYI
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  );
}
